const logo = document.getElementById("logo");
const icon = document.getElementById("theme-icon");
const btn = document.getElementById("theme-btn");
const text = document.getElementById("text-pad");
const cntChar = document.getElementById("count-chars");
const cntWord = document.getElementById("count-words");
const cntSentence = document.getElementById("count-sentences");
const ctx = document.getElementById("chart").getContext("2d");

let chart = null;

function updateTheme() {
    if (document.body.className == "light") {
        logo.src = "assets/images/logo-light-theme.svg";
        icon.src = "assets/images/icon-moon.svg";
        btn.style = "background-color: white;"
    } else {
        logo.src = "assets/images/logo-dark-theme.svg";
        icon.src = "assets/images/icon-sun.svg";
        btn.style = "background-color: grey;"
    }
}

function updateChart(labels, values) {

    if (chart !== null) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [],
          datasets: [{
            label: "Letter Frequency (%)",
            data: [],
            backgroundColor: "rgba(75, 192, 192, 0.6)"
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "%" }
            }
          }
        }
      });

      // Update chart
      chart.data.labels = labels;
      chart.data.datasets[0].data = values;
      chart.update();
}

btn.addEventListener("click", () => {
    if (document.body.className == "dark") {
        document.body.className = "light";
    } else {
        document.body.className = "dark";
    }
    updateTheme();
})

text.addEventListener("input", () => {
    const str = text.value.trim();
    cntChar.textContent = str.length;
    cntWord.textContent = str.split(" ").length;
    cntSentence.textContent = str.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    
    const density = {};
    for (let char of str) {
        if (/[a-z]/.test(char)) {
            density[char] = (density[char] || 0) + 1;
        }
        if (/[A-Z]/.test(char)) {
            density[char.toLowerCase()] = (density[char.toLowerCase()] || 0) + 1;
        }
    }

    const total = Object.values(density).reduce((a, b) => a + b, 0);

    let entries = Object.entries(density).map(([letter, count]) => [
        letter,
        (count / total * 100).toFixed(2)
      ]);
      
      // Sort by frequency (descending)
      entries.sort((a, b) => b[1] - a[1]);
      
      // Split back into labels and values
      const labels = entries.map(e => e[0]);
      const values = entries.map(e => e[1]);

    updateChart(labels, values);
})