document.addEventListener("DOMContentLoaded", function () {
  const homeScreen = document.getElementById("home");
  const quizScreen = document.getElementById("quiz");
  const resultScreen = document.getElementById("result");
  // const startQuizBtn = document.getElementById("startQuiz");

  const difficultyBtns = document.querySelectorAll(".btn-difficulty");
  const restartQuizBtn = document.getElementById("restartQuiz");

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const progressTextEl = document.getElementById("progress-text");
  const progressBarEl = document.getElementById("progress-bar");
  const finalScoreEl = document.getElementById("finalScore");
  const resultSubtitleEl = document.getElementById("result-subtitle");

  let allQuestions = [];
  let selectedQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let currentDifficulty = "";

  // Fisher-Yates Shuffle Algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Function to load questions from JSON
  function loadQuestions(difficulty) {
    currentDifficulty = difficulty;
    if (allQuestions.length > 0) {
      prepareQuiz(currentDifficulty);
    } else {
      fetch("questions.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          allQuestions = data.questions;
          prepareQuiz(currentDifficulty);
        })
        .catch((error) => console.error("Error loading questions:", error));
    }
  }

  // Prepares a new quiz round
  function prepareQuiz(difficulty) {
    const filteredQuestions = allQuestions.filter(
      (q) => q.difficulty === difficulty,
    );
    if (filteredQuestions.length < 1) {
      alert(
        `Sorry, no questions are available for the '${difficulty}' level yet.`,
      );
      return;
    }
    let shuffledQuestions = shuffleArray([...filteredQuestions]);
    selectedQuestions = shuffledQuestions.slice(0, 5);
    if (selectedQuestions.length > 0) {
      startQuiz();
    } else {
      alert(
        `Not enough questions to start a quiz for the '${difficulty}' level.`,
      );
    }
  }

  // Function to start the quiz
  function startQuiz() {
    score = 0;
    currentIndex = 0;
    homeScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    showQuestion();
  }

  // Function to display a question
  function showQuestion() {
    if (currentIndex >= selectedQuestions.length) {
      showResult();
      return;
    }
    // Update progress bar and text
    const progressPercentage = (currentIndex / selectedQuestions.length) * 100;
    progressBarEl.style.width = `${progressPercentage}%`;
    progressTextEl.textContent = `Question ${currentIndex + 1} of ${selectedQuestions.length}`;

    let question = selectedQuestions[currentIndex];
    questionEl.textContent = question.question;
    optionsEl.innerHTML = "";
    // Re-enable options for new question
    optionsEl.classList.remove("options-disabled");

    question.options.forEach((option, index) => {
      let optionEl = document.createElement("div");
      optionEl.textContent = option;
      optionEl.classList.add("option");
      optionEl.addEventListener("click", () => checkAnswer(index, optionEl));
      optionsEl.appendChild(optionEl);
    });
  }

  // Function to check the selected answer
  function checkAnswer(selectedIndex) {
    let question = selectedQuestions[currentIndex];
    let correctIndex = question.correct;
    let optionEls = document.querySelectorAll(".option");

    // Disable further clicks
    optionsEl.classList.add("options-disabled");

    if (selectedIndex === correctIndex) {
      optionEls[selectedIndex].classList.add("correct");
      score++;
    } else {
      optionEls[selectedIndex].classList.add("wrong");
      optionEls[correctIndex].classList.add("correct");
    }

    // Move to next question after a delay
    setTimeout(() => {
      currentIndex++;
      showQuestion();
    }, 1500);
  }

  // Function to show quiz results
  function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    finalScoreEl.textContent = `You scored ${score} / ${selectedQuestions.length}!`;

    const scorePercent = (score / selectedQuestions.length) * 100;
    let feedbackMessage = "";
    let feedbackColor = "";

    if (scorePercent === 100) {
      feedbackMessage = "Excellent! You're a cybersecurity pro!";
      feedbackColor = "#2ecc71";
    } else if (scorePercent >= 80) {
      feedbackMessage =
        "Great job! You have a strong understanding of security.";
      feedbackColor = "#3498db";
    } else if (scorePercent >= 60) {
      feedbackMessage = "Good score! You know the basics well.";
      feedbackColor = "#f0f0f0";
    } else if (scorePercent >= 40) {
      feedbackMessage = "Not bad, but there's room to improve. Keep learning!";
      feedbackColor = "#f1c40f";
    } else {
      feedbackMessage =
        "Good effort! This is a great starting point for learning more.";
      feedbackColor = "#e74c3c";
    }

    resultSubtitleEl.textContent = feedbackMessage;
    resultSubtitleEl.style.color = feedbackColor;

    // Reset the progress bar for the next round
    progressBarEl.style.width = "0%";
  }

  // Event Listeners
  // startQuizBtn.addEventListener("click", loadQuestions);
  difficultyBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      // Get the difficulty from the data-difficulty attribute
      const difficulty = event.target.dataset.difficulty;
      loadQuestions(difficulty);
    });
  });

  restartQuizBtn.addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    // No need to reload questions, just prepare a new set
    // prepareQuiz();
  });
});
