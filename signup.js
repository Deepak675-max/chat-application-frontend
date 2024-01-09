const axoisInstance = axios.create({
    baseURL: 'http://13.200.172.204:4500/api/auth'
})

async function signupUser(userData) {
    const msg = document.querySelector('.msg');
    try {
        console.log(userData);
        const responseData = await axoisInstance.post('/signup', userData);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data
    } catch (error) {
        console.log(error);
        msg.classList.add('error');
        msg.innerHTML = error.message;
        setTimeout(() => msg.remove(), 3000);
        throw error;
    }
}

const signupBtn = document.querySelector('#signup-btn');

signupBtn.addEventListener('click', createAccount);

function createAccount(event) {
    event.preventDefault();
    const userName = document.getElementById('username');
    const email = document.getElementById('email');
    const phoneNumber = document.getElementById('phone_number');
    const password = document.getElementById('password');
    const msg = document.querySelector('.msg');
    if (userName.value === '' || email.value === '' || password.value === '' || phoneNumber.value === "") {
        msg.classList.add('error');
        msg.innerHTML = 'Please enter all fields';
        setTimeout(() => msg.remove(), 3000);
    } else {
        const userData = {
            userName: userName.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            password: password.value,
        }

        signupUser(userData)
            .then(data => {
                console.log(data);
                msg.innerHTML = "<h5>Account Created Successfully.";
                window.location.href = "login.html";
            })
            .catch(error => {
                console.log(error);
            })

        // Clear fields
        userName.value = '';
        email.value = '';
        phoneNumber.value = '';
        password.value = '';
    }
}
