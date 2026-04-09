const params = new URLSearchParams(window.location.search);
const eventName = params.get('event') || 'Event';

document.getElementById('pageTitle').textContent = `Register for ${eventName}`;
document.getElementById('eventTitle').textContent = eventName;

document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input, textarea');
    for (let inp of inputs) {
        if (!inp.checkValidity()) {
            inp.reportValidity(); 
            return; 
        }
    }
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('successMsg').style.display = 'block';
});
