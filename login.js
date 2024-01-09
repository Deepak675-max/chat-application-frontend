const axoisInstance = axios.create({
    baseURL: 'http://localhost:4500/api/auth'
})

const loginBtn = document.querySelector('#login-btn');

loginBtn.addEventListener('click', login);

function login(event) {
    event.preventDefault();
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const msg = document.querySelector("#msg");
    if (email.value === '' || password.value === '') {
        msg.innerHTML = 'Please enter all fields';
        msg.style.color = 'red';
        msg.style.textAlign = 'center';
        setTimeout(() => msg.remove(), 3000);
    } else {
        const userData = {
            email: email.value,
            password: password.value
        }
        loginUser(userData)
            .then(responseData => {
                console.log(responseData);
                const token = responseData.token;
                localStorage.setItem('token', token);
                window.location.href = `index.html`;
            })
            .catch(error => {
                console.log(error);
                msg.innerHTML = `<h5>${error.message}</h5>`
                msg.style.color = 'red';
                msg.style.textAlign = 'center';
                setTimeout(() => msg.innerHTML = "", 5000);
            })
    }

}

async function loginUser(userData) {
    try {
        const responseData = await axoisInstance.post('/login', userData);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}



// async function sendResetPasswordLink(userData) {
//     try {
//         const responseData = await axoisInstance.post('/forgot-password', userData);
//         if (responseData.data.error) {
//             throw responseData.data.error
//         }
//         return responseData.data.data.emailDetails
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }


// document.getElementById('forgotpassword-btn').addEventListener('click', async function (event) {
//     event.preventDefault();
//     const email = document.getElementById('email').value;
//     const userData = {
//         email: email
//     }
//     const res = await sendResetPasswordLink(userData);
//     document.getElementById('msg').innerText = res.message;
// })