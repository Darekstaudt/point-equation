// Utility to generate a random integer in [min, max]
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random slope and intercept
function randomLine() {
    const m = randInt(-5, 5);
    const b = randInt(-10, 10);
    return { m, b };
}

// Generate a random point, sometimes on the line, sometimes not
function randomPoint(line) {
    const onLine = Math.random() < 0.5;
    const x = randInt(-10, 10);
    let y;
    if (onLine) {
        y = line.m * x + line.b;
    } else {
        // Offset y by a random integer between 1 and 5
        y = line.m * x + line.b + randInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
    }
    return { x, y, onLine };
}

// Render the problem
function renderProblem() {
    line = randomLine();
    point = randomPoint(line);
    document.getElementById('problem').innerHTML =
        `<p>Given the line equation: <b>y = ${line.m}x + ${line.b}</b></p>
         <p>Is the point <b>(${point.x}, ${point.y})</b> on the line?</p>`;
    document.getElementById('feedback').textContent = '';
    document.getElementById('solutionBox').innerHTML = '';
    document.querySelector('.expander-content').style.display = 'none';
    // Remove canvas if exists
    const oldCanvas = document.getElementById('plot');
    if (oldCanvas) oldCanvas.remove();
    // Hide next question button if exists
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'none';
}

// Plot the line and point on canvas
function plotLineAndPoint(line, point, container) {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'plot';
    canvas.width = 400;
    canvas.height = 400;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Axes: -10 to 10
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    // x-axis
    ctx.moveTo(0, 200); ctx.lineTo(400, 200);
    // y-axis
    ctx.moveTo(200, 0); ctx.lineTo(200, 400);
    ctx.stroke();
    // Tick marks and labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#555';
    for (let i = -10; i <= 10; i++) {
        // x ticks
        let px = 200 + i * 20;
        ctx.beginPath();
        ctx.moveTo(px, 195); ctx.lineTo(px, 205);
        ctx.stroke();
        if (i !== 0) ctx.fillText(i, px - 6, 220);
        // y ticks
        let py = 200 - i * 20;
        ctx.beginPath();
        ctx.moveTo(195, py); ctx.lineTo(205, py);
        ctx.stroke();
        if (i !== 0) ctx.fillText(i, 175, py + 4);
    }
    // Line
    ctx.strokeStyle = '#0078d7';
    ctx.beginPath();
    let first = true;
    for (let x = -10; x <= 10; x += 0.1) {
        let y = line.m * x + line.b;
        if (y < -10 || y > 10) continue;
        let px = 200 + x * 20;
        let py = 200 - y * 20;
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
    // Point
    ctx.fillStyle = point.onLine ? '#28a745' : '#dc3545';
    let px = 200 + point.x * 20;
    let py = 200 - point.y * 20;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`(${point.x}, ${point.y})`, px + 8, py - 8);
}

// Show solution
function showSolution() {
    const { m, b } = line;
    const { x, y, onLine } = point;
    let expectedY = m * x + b;
    let isOnLine = Math.abs(y - expectedY) < 1e-6;
    let answer = isOnLine ? 'Yes' : 'No';
    let solutionHtml = `<b>Solution:</b><br>
        Substitute x = ${x} into the equation:<br>
        y = ${m} * ${x} + ${b} = ${expectedY}<br>
        The point's y-coordinate is ${y}.<br>
        <b>Is ${y} = ${expectedY}?</b><br>
        <b>Answer: ${answer}</b><br>
        <br>
        <b>Plot:</b> The blue line is y = ${m}x + ${b}. The point is shown in ${isOnLine ? 'green' : 'red'}.`;
    const solutionBox = document.getElementById('solutionBox');
    solutionBox.innerHTML = solutionHtml;
    // Add canvas for plot
    plotLineAndPoint(line, point, solutionBox);
    document.querySelector('.expander-content').style.display = 'block';
    // Show next question button
    let nextBtn = document.getElementById('nextBtn');
    if (!nextBtn) {
        nextBtn = document.createElement('button');
        nextBtn.id = 'nextBtn';
        nextBtn.textContent = 'Next Question';
        nextBtn.style.marginTop = '1em';
        nextBtn.onclick = () => renderProblem();
        solutionBox.appendChild(nextBtn);
    } else {
        nextBtn.style.display = 'inline-block';
    }
}

// Handle answer form
function handleForm(e) {
    e.preventDefault();
    const userAnswer = document.querySelector('input[name="userAnswer"]:checked');
    if (!userAnswer) return;
    const correct = (userAnswer.value === (point.onLine ? 'yes' : 'no'));
    document.getElementById('feedback').textContent = correct ? 'Correct!' : 'Incorrect.';
}

// State
let line, point;

// Initial render
renderProblem();

// Event listeners
showSolutionBtn = document.getElementById('showSolution');
showSolutionBtn.onclick = showSolution;
document.getElementById('answerForm').onsubmit = handleForm;
