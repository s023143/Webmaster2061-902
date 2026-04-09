document.addEventListener('DOMContentLoaded', () => {
    const faqs = document.querySelectorAll('.faq');

    faqs.forEach(faq => {
        const btn = faq.querySelector('.question');
        const answer = faq.querySelector('.answer');

        btn.addEventListener('click', () => {
            const isOpen = faq.classList.contains('active');

            //close all of the other tabs
            faqs.forEach(f => {
                f.classList.remove('active');
                f.querySelector('.question').setAttribute('aria-expanded', 'false');
                f.querySelector('.answer').setAttribute('hidden', '');
            });

            //toggle current
            if(!isOpen){
                faq.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
                answer.removeAttribute('hidden');
            };
        });
    });
});