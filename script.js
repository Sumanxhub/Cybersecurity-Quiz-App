document.addEventListener("DOMContentLoaded", function() {
  const homeScreen = document.getElementById("home");
  const quizScreen = document.getElementById("quiz");
  const resultScreen = document.getElementById("result");
  const startQuizBtn = document.getElementById("startQuiz");
  const restartQuizBtn = document.getElementById("restartQuiz");
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const progressEl = document.getElementById("progress");
  const finalScoreEl = document.getElementById("finalScore");

  let selectedQuestions = [];
  let currentIndex = 0;
  let score = 0;

  // Fisher-Yates Shuffle Algorithm for better randomization
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  // Function to load and shuffle questions
  function loadQuestions() {
    fetch("questions.json")
      .then(response => response.json())
      .then(data => {
        let shuffledQuestions = shuffleArray([...data.questions]); // True random shuffle
        selectedQuestions = shuffledQuestions.slice(0, 5); // Pick 5 unique questions
        startQuiz();
      })
      .catch(error => console.error("Error loading questions:", error));
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

    let question = selectedQuestions[currentIndex];
    questionEl.textContent = question.question;
    optionsEl.innerHTML = "";

    question.options.forEach((option, index) => {
      let optionEl = document.createElement("div");
      optionEl.textContent = option;
      optionEl.classList.add("option");

      // Attach click event listener
      optionEl.addEventListener("click", function() {
        checkAnswer(index);
      });

      optionsEl.appendChild(optionEl);
    });

    progressEl.textContent = `Question ${currentIndex + 1} of ${selectedQuestions.length}`;
  }

  // Function to check the selected answer
  function checkAnswer(selectedIndex) {
    let question = selectedQuestions[currentIndex];
    let correctIndex = question.correct;
    let optionEls = document.querySelectorAll(".option");

    // Disable further clicks after selection
    optionEls.forEach(el => el.style.pointerEvents = "none");

    // Highlight selected option
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
    }, selectedIndex === correctIndex ? 1000 : 2000);
  }

  // Function to show quiz results
  function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    finalScoreEl.textContent = `You scored ${score}/${selectedQuestions.length}!`;
  }

  // Restart Quiz (Shuffle & Pick 5 New Questions)
  restartQuizBtn.addEventListener("click", function() {
    homeScreen.classList.remove("hidden");
    resultScreen.classList.add("hidden");
    allQuestions = [];
    selectedQuestions = [];
    currentIndex = 0;
    score = 0;
    loadQuestions();
  });

  // Load questions when the quiz starts
  startQuizBtn.addEventListener("click", loadQuestions);
});

