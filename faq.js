document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll(".question");
  
    questions.forEach(question => {
      question.addEventListener("click", () => {
        const currentFaq = question.parentElement;
  
        document.querySelectorAll(".faq").forEach(faq => {
          if (faq !== currentFaq) {
            faq.classList.remove("active");
          }
        });
  
        currentFaq.classList.toggle("active");
      });
    });
  });