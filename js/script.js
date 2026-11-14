/* =========================================================
   FUTURE SHAPERS - SHARED JAVASCRIPT
   Handles subject navigation, page scrolling, sticky nav, and the quiz.
   ========================================================= */

"use strict";

/* Read the current subject from the body element. */
const currentSubject = document.body.dataset.subject;

/* Highlight the current subject in the top navigation. */
const subjectLinks = document.querySelectorAll("[data-subject-link]");

subjectLinks.forEach((link) => {
    if (link.dataset.subjectLink === currentSubject) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
    }
});

/* Scroll buttons to the section named in data-scroll-to. */
const scrollButtons = document.querySelectorAll("[data-scroll-to]");

scrollButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault(); // Prevents default jump if the button is an <a> tag
    
    const sectionId = button.dataset.scrollTo;
    const targetSection = document.getElementById(sectionId);
    const navbarHeight = 100; // Change this to your exact navbar height in pixels

    if (targetSection) {
      // 1. Find the actual scrollable parent container
      let scrollContainer = targetSection.parentElement;
      while (scrollContainer) {
        const style = window.getComputedStyle(scrollContainer);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          scrollContainer.scrollHeight > scrollContainer.clientHeight
        ) {
          break; // Found the scrolling container!
        }
        scrollContainer = scrollContainer.parentElement;
      }

      // 2. Scroll either the custom container or the main window
      if (scrollContainer && scrollContainer !== document.body && scrollContainer !== document.documentElement) {
        const containerTop = scrollContainer.getBoundingClientRect().top;
        const targetTop = targetSection.getBoundingClientRect().top;
        const scrollPosition = scrollContainer.scrollTop + (targetTop - containerTop) - navbarHeight;

        scrollContainer.scrollTo({
          top: scrollPosition,
          behavior: "smooth"
        });
      } else {
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  });
});


/* Quiz behavior. Each answer button has a data-answer number. */
const quizOptions = document.querySelectorAll(".quiz-option");
const quizFeedback = document.getElementById("quiz-feedback");
const retryButton = document.getElementById("quiz-retry");

/* The correct answer is set on each page using data-correct-answer. */
const correctAnswer = Number(
    document.body.dataset.correctAnswer ?? getCorrectAnswerForPage()
);

function getCorrectAnswerForPage() {
    const answerBySubject = {
        mm: 2,
        science: 0,
        civ: 2
    };

    return answerBySubject[currentSubject] ?? 0;
}

function checkQuizAnswer(selectedAnswer) {
    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
        quizFeedback.textContent = getCorrectFeedback();
        quizFeedback.className = "quiz-feedback is-correct";
    } else {
        quizFeedback.textContent = getWrongFeedback();
        quizFeedback.className = "quiz-feedback is-wrong";
    }

    /* Prevent selecting several answers before retrying. */
    quizOptions.forEach((option) => {
        option.disabled = true;
    });
}

function getCorrectFeedback() {
    const feedbackBySubject = {
        mm: "မှန်ပါတယ်။ “ချက်သည်” သည် လုပ်ဆောင်မှုကို ဖော်ပြသော ကြိယာဖြစ်ပါတယ်။",
        science: "မှန်ပါတယ်။ ဝတ်ဆံဖို၏ အဖျားပိုင်းမှ ဝတ်မှုန်များ ထွက်ပေါ်ပါတယ်။",
        civ: "အလွန်ကောင်းပါတယ်။ နားထောင်ပြီး ညှိနှိုင်းခြင်းက ငြိမ်းချမ်းသော ဖြေရှင်းနည်းဖြစ်ပါတယ်။"
    };

    return feedbackBySubject[currentSubject] ?? "Correct!";
}

function getWrongFeedback() {
    const feedbackBySubject = {
        mm: "ပြန်စဉ်းစားကြည့်ပါ။ ဘာလုပ်သလဲဆိုတာကို ဖော်ပြတဲ့ စကားလုံးကို ရွေးပါ။",
        science: "ထပ်စဉ်းစားကြည့်ပါ။ ပန်းပွင့်၏ အဖိုမျိုးပွားအင်္ဂါနှင့် ဆက်စပ်သော အရာကို ရွေးပါ။",
        civ: "ပြန်စဉ်းစားကြည့်ပါ။ အားလုံးကို လေးစားပြီး အတူတကွ ဖြေရှင်းနိုင်မယ့် နည်းလမ်းကို ရွေးပါ။"
    };

    return feedbackBySubject[currentSubject] ?? "Try again!";
}

quizOptions.forEach((option) => {
    option.addEventListener("click", () => {
        const selectedAnswer = Number(option.dataset.answer);
        checkQuizAnswer(selectedAnswer);
    });
});

/* Reset the quiz so the student can try again. */
if (retryButton) {
    retryButton.addEventListener("click", () => {
        quizOptions.forEach((option) => {
            option.disabled = false;
        });

        quizFeedback.textContent = "";
        quizFeedback.className = "quiz-feedback";
    });
}

/* =========================================================
   STICKY NAVIGATION ACTIVE STATE
   Adds .is-stuck when the top nav locks to the top edge.
   ========================================================= */
const stickyNav = document.getElementById('lesson-nav');

if (stickyNav) {
    const stickyObserver = new IntersectionObserver(
        ([entry]) => {
            stickyNav.classList.toggle("is-stuck", entry.intersectionRatio < 1);
        },
        { threshold: [1] }
    );

    stickyObserver.observe(stickyNav);
}
