const axoisInstance = axios.create({
    baseURL: 'http://13.200.172.204:4500/api'
});

const socket = io("http://13.200.172.204:4500");


$('#multiple-select-field').select2({
    theme: "bootstrap-5",
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
    closeOnSelect: false,
});

async function getUserFromToken() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('unauthorized user');
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.get('/auth/get-user', config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.user;
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.get('/users', config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.users;
    } catch (error) {
        throw error;
    }
}

async function getUserDetails(userId) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.get('/users/' + userId, config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.userDetails;
    } catch (error) {
        throw error;
    }
}

async function getProfilePicture(userId) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.get('/users/profile-picture/' + userId, config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.profilePicture;
    } catch (error) {
        throw error;
    }
}

async function getUserAllChats() {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.get('/users/chats', config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.chats;
    } catch (error) {
        throw error;
    }
}

async function getChatDetails(chatId) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.get('/users/chats/' + chatId, config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.chat;
    } catch (error) {
        throw error;
    }
}

async function createGroupChat(chatDetalis) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }
        console.log('config = ', config);
        console.log('chat body = ', chatDetalis);

        const responseData = await axoisInstance.post('/users/group-chat', chatDetalis, config);
        console.log("response = ", responseData)
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.chatDetails;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function createPrivateChat(chatDetalis) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.post('/users/private-chat', chatDetalis, config);
        console.log("response = ", responseData)
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.chatDetails;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getChatMessages(chatId) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.get('/chats/' + chatId + '/messages', config);
        if (responseData.data.error) {
            throw responseData.data.error;
        }
        return responseData.data.data.chatMessages;
    } catch (error) {
        throw error;
    }
}

async function addMessage(messageBody) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.post('/chats/message', messageBody, config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.chatDetails;
    } catch (error) {
        throw error;
    }
}

async function updateUserProfilePhoto(fileDetails) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.put('/users/update-profile-photo', fileDetails, config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.chatDetails;
    } catch (error) {
        throw error;
    }
}

async function getUserActivityStatus(userId) {
    try {
        const token = window.localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const responseData = await axoisInstance.get('/users/' + userId + '/activity', config);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data.userActivity;
    } catch (error) {
        throw error;
    }
}

async function logoutUser() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('unauthorized user');
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        console.log(config)
        const responseData = await axoisInstance.get('/auth/logout', config);
        console.log(responseData);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        return responseData.data.data;
    } catch (error) {
        throw error;
    }
}

document.getElementById('logout-btn').addEventListener('click', (event) => {
    event.preventDefault();
    logoutUser()
        .then(async (responseData) => {
            localStorage.clear('token');
            // socket.emit('disconnect');
            window.location.href = 'login.html';
            console.log("deepak");
        })
        .catch(error => {
            console.log(error);
        })
});

async function sendMessageToUser(event) {
    event.preventDefault();
    try {
        const user = await getUserFromToken();
        const chatMessage = document.getElementById('chat-message').value;
        const recipientId = document.getElementById('chat-message').getAttribute('recipientId');
        const chatId = document.getElementById('chat-box-body').getAttribute('chatId');
        const chatBoxBody = document.getElementById('chat-box-body');
        const messageBody = {
            chatId: chatId,
            senderId: user.userId,
            content: chatMessage,
        }
        const createdMessage = await addMessage(messageBody);
        const chatBox = document.getElementById('chat-box');
        console.log("recipient id = ", recipientId);
        if (recipientId != "null") {
            chatBoxBody.innerHTML += `<div class="d-flex justify-content-end mb-2" id="sender">
                <div id="sender-msg">
                    <p class="m-2">${chatMessage}</p>
                    <div class="d-flex justify-content-end">
                        <span style="font-size: x-small;">${convertToCustomFormat(new Date())}</span>
                    </div>
                </div>
            </div>`
            socket.emit("privateMessage", { userId: recipientId, message: chatMessage });
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        else {
            chatBoxBody.innerHTML += `<div class="d-flex justify-content-end mb-2" id="sender">   
                <div id="sender-msg">
                    <h6 style="color: darkblue">you</h6>
                    <p class="m-2">${chatMessage}</p>
                    <div class="d-flex justify-content-end">
                        <span style="font-size: x-small;">${convertToCustomFormat(new Date())}</span>
                    </div>
                </div>
            </div>`
            socket.emit("groupMessage", { groupId: chatId, message: chatMessage });
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        document.getElementById('chat-message').value = "";

    } catch (error) {
        throw error;
    }
}

document.getElementById('send-msg-btn').addEventListener('click', sendMessageToUser);
document.getElementById('input-form').addEventListener('submit', sendMessageToUser);


socket.on("privateMessage", ({ userId, message }) => {
    const chatBoxBody = document.getElementById('chat-box-body');
    const chatBox = document.getElementById('chat-box');
    chatBoxBody.innerHTML += `<div class="d-flex justify-content-start mb-2" id="receiver">
        <div id="receiver-msg">
            <p class="m-2">${message}</p>
            <div class="d-flex justify-content-end">
                <span style="font-size: x-small;">${convertToCustomFormat(new Date())}</span>
            </div>
        </div>
    </div>`
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("groupMessage", async ({ userId, message }) => {
    const chatBoxBody = document.getElementById('chat-box-body');
    const chatBox = document.getElementById('chat-box');
    const user = await getUserDetails(userId);
    chatBoxBody.innerHTML += `<div class="d-flex justify-content-start mb-2" id="receiver">
        <div id="receiver-msg">
            <h6 style="color: rgb(76, 114, 76)">${user.userName}</h6>
            <p class="m-2">${message}</p>
            <div class="d-flex justify-content-end">
                <span style="font-size: x-small;">${convertToCustomFormat(new Date())}</span>
            </div>
        </div>
    </div>`
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("getUserActivityStatus", async ({ userId, status }) => {
    const chatBoxBody = document.getElementById('chat-box-body');
    const userStatus = document.getElementById('user-status');
    const currReciverId = chatBoxBody.getAttribute("userId");
    if (currReciverId == userId) {
        if (status === "Online")
            userStatus.innerText = status;
        else {
            userStatus.innerText = "";
            setTimeout(() => {
                userStatus.innerText = convertToCustomFormat(status, true);
            }, 3000)
        }
    }
});



window.addEventListener('DOMContentLoaded', async function (event) {
    try {
        event.preventDefault();
        const userAllChats = await getUserAllChats();
        showAllChats(userAllChats);
        const user = await getUserFromToken();
        socket.emit('storeUserInfo', { userId: user.userId });
        const userProfilePhoto = await getProfilePicture(user.userId);
        document.getElementById('profile-photo').src = userProfilePhoto ? "http://localhost:4500/files/" + userProfilePhoto : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
        const rightBox = document.getElementById('right-box');
        rightBox.style.display = 'none';
        const demoBox = document.getElementById('demo-box');
        demoBox.style.display = 'block';
        const demoContent = document.getElementById('demo-content');
        demoContent.innerHTML = `<div class="_3SOOk" style="opacity: 1;"><span data-icon="intro-md-beta-logo-light"
        class="_3PwsU"><svg viewBox="0 0 303 172" width="360"
            preserveAspectRatio="xMidYMid meet" class="" fill="none">
            <title>intro-md-beta-logo-light</title>
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M229.565 160.229C262.212 149.245 286.931 118.241 283.39 73.4194C278.009 5.31929 212.365 -11.5738 171.472 8.48673C115.998 35.6999 108.972 40.1612 69.2388 40.1612C39.645 40.1612 9.51318 54.4147 5.7467 92.952C3.0166 120.885 13.9985 145.267 54.6373 157.716C128.599 180.373 198.017 170.844 229.565 160.229Z"
                fill="#DAF7F3"></path>
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M131.589 68.9422C131.593 68.9422 131.596 68.9422 131.599 68.9422C137.86 68.9422 142.935 63.6787 142.935 57.1859C142.935 50.6931 137.86 45.4297 131.599 45.4297C126.518 45.4297 122.218 48.8958 120.777 53.6723C120.022 53.4096 119.213 53.2672 118.373 53.2672C114.199 53.2672 110.815 56.7762 110.815 61.1047C110.815 65.4332 114.199 68.9422 118.373 68.9422C118.377 68.9422 118.381 68.9422 118.386 68.9422H131.589Z"
                fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M105.682 128.716C109.186 128.716 112.026 125.908 112.026 122.446C112.026 118.983 109.186 116.176 105.682 116.176C104.526 116.176 103.442 116.481 102.509 117.015L102.509 116.959C102.509 110.467 97.1831 105.203 90.6129 105.203C85.3224 105.203 80.8385 108.616 79.2925 113.335C78.6052 113.143 77.88 113.041 77.1304 113.041C72.7503 113.041 69.1995 116.55 69.1995 120.878C69.1995 125.207 72.7503 128.716 77.1304 128.716C77.1341 128.716 77.1379 128.716 77.1416 128.716H105.682L105.682 128.716Z"
                fill="white"></path>
            <rect x="0.445307" y="0.549558" width="50.5797" height="100.068" rx="7.5"
                transform="matrix(0.994522 0.104528 -0.103907 0.994587 10.5547 41.6171)"
                fill="#42CBA5" stroke="#316474"></rect>
            <rect x="0.445307" y="0.549558" width="50.4027" height="99.7216" rx="7.5"
                transform="matrix(0.994522 0.104528 -0.103907 0.994587 10.9258 37.9564)"
                fill="white" stroke="#316474"></rect>
            <path
                d="M57.1609 51.7354L48.5917 133.759C48.2761 136.78 45.5713 138.972 42.5503 138.654L9.58089 135.189C6.55997 134.871 4.36688 132.165 4.68251 129.144L13.2517 47.1204C13.5674 44.0992 16.2722 41.9075 19.2931 42.2251L24.5519 42.7778L47.0037 45.1376L52.2625 45.6903C55.2835 46.0078 57.4765 48.7143 57.1609 51.7354Z"
                fill="#EEFEFA" stroke="#316474"></path>
            <path
                d="M26.2009 102.937C27.0633 103.019 27.9323 103.119 28.8023 103.21C29.0402 101.032 29.2706 98.8437 29.4916 96.6638L26.8817 96.39C26.6438 98.5681 26.4049 100.755 26.2009 102.937ZM23.4704 93.3294L25.7392 91.4955L27.5774 93.7603L28.7118 92.8434L26.8736 90.5775L29.1434 88.7438L28.2248 87.6114L25.955 89.4452L24.1179 87.1806L22.9824 88.0974L24.8207 90.3621L22.5508 92.197L23.4704 93.3294ZM22.6545 98.6148C22.5261 99.9153 22.3893 101.215 22.244 102.514C23.1206 102.623 23.9924 102.697 24.8699 102.798C25.0164 101.488 25.1451 100.184 25.2831 98.8734C24.4047 98.7813 23.5298 98.6551 22.6545 98.6148ZM39.502 89.7779C38.9965 94.579 38.4833 99.3707 37.9862 104.174C38.8656 104.257 39.7337 104.366 40.614 104.441C41.1101 99.6473 41.6138 94.8633 42.1271 90.0705C41.2625 89.9282 40.3796 89.8786 39.502 89.7779ZM35.2378 92.4459C34.8492 96.2179 34.4351 99.9873 34.0551 103.76C34.925 103.851 35.7959 103.934 36.6564 104.033C37.1028 100.121 37.482 96.1922 37.9113 92.2783C37.0562 92.1284 36.18 92.0966 35.3221 91.9722C35.2812 92.1276 35.253 92.286 35.2378 92.4459ZM31.1061 94.1821C31.0635 94.341 31.0456 94.511 31.0286 94.6726C30.7324 97.5678 30.4115 100.452 30.1238 103.348L32.7336 103.622C32.8582 102.602 32.9479 101.587 33.0639 100.567C33.2611 98.5305 33.5188 96.4921 33.6905 94.4522C32.8281 94.3712 31.9666 94.2811 31.1061 94.1821Z"
                fill="#316474"></path>
            <path
                d="M17.892 48.4889C17.7988 49.3842 18.4576 50.1945 19.3597 50.2923C20.2665 50.3906 21.0855 49.7332 21.1792 48.8333C21.2724 47.938 20.6136 47.1277 19.7115 47.0299C18.8047 46.9316 17.9857 47.5889 17.892 48.4889Z"
                fill="white" stroke="#316474"></path>
            <path
                d="M231.807 136.678L197.944 139.04C197.65 139.06 197.404 139.02 197.249 138.96C197.208 138.945 197.179 138.93 197.16 138.918L196.456 128.876C196.474 128.862 196.5 128.843 196.538 128.822C196.683 128.741 196.921 128.668 197.215 128.647L231.078 126.285C231.372 126.265 231.618 126.305 231.773 126.365C231.814 126.381 231.842 126.395 231.861 126.407L232.566 136.449C232.548 136.463 232.522 136.482 232.484 136.503C232.339 136.584 232.101 136.658 231.807 136.678Z"
                fill="white" stroke="#316474"></path>
            <path
                d="M283.734 125.679L144.864 135.363C141.994 135.563 139.493 133.4 139.293 130.54L133.059 41.6349C132.858 38.7751 135.031 36.2858 137.903 36.0856L276.773 26.4008C279.647 26.2005 282.144 28.364 282.345 31.2238L288.578 120.129C288.779 122.989 286.607 125.478 283.734 125.679Z"
                fill="white"></path>
            <path
                d="M144.864 135.363C141.994 135.563 139.493 133.4 139.293 130.54L133.059 41.6349C132.858 38.7751 135.031 36.2858 137.903 36.0856L276.773 26.4008C279.647 26.2004 282.144 28.364 282.345 31.2238L288.578 120.129C288.779 122.989 286.607 125.478 283.734 125.679"
                stroke="#316474"></path>
            <path
                d="M278.565 121.405L148.68 130.463C146.256 130.632 144.174 128.861 144.012 126.55L138.343 45.695C138.181 43.3846 139.994 41.3414 142.419 41.1723L272.304 32.1142C274.731 31.945 276.81 33.7166 276.972 36.0271L282.641 116.882C282.803 119.193 280.992 121.236 278.565 121.405Z"
                fill="#EEFEFA" stroke="#316474"></path>
            <path
                d="M230.198 129.97L298.691 125.193L299.111 131.189C299.166 131.97 299.013 132.667 298.748 133.161C298.478 133.661 298.137 133.887 297.825 133.909L132.794 145.418C132.482 145.44 132.113 145.263 131.777 144.805C131.445 144.353 131.196 143.684 131.141 142.903L130.721 136.907L199.215 132.131C199.476 132.921 199.867 133.614 200.357 134.129C200.929 134.729 201.665 135.115 202.482 135.058L227.371 133.322C228.188 133.265 228.862 132.782 229.345 132.108C229.758 131.531 230.05 130.79 230.198 129.97Z"
                fill="#42CBA5" stroke="#316474"></path>
            <path
                d="M230.367 129.051L300.275 124.175L300.533 127.851C300.591 128.681 299.964 129.403 299.13 129.461L130.858 141.196C130.025 141.254 129.303 140.627 129.245 139.797L128.987 136.121L198.896 131.245C199.485 132.391 200.709 133.147 202.084 133.051L227.462 131.281C228.836 131.185 229.943 130.268 230.367 129.051Z"
                fill="white" stroke="#316474"></path>
            <ellipse rx="15.9969" ry="15.9971"
                transform="matrix(0.997577 -0.0695704 0.0699429 0.997551 210.659 83.553)"
                fill="#42CBA5" stroke="#316474"></ellipse>
            <path
                d="M208.184 87.1094L204.777 84.3593C204.777 84.359 204.776 84.3587 204.776 84.3583C203.957 83.6906 202.744 83.8012 202.061 84.6073C201.374 85.4191 201.486 86.6265 202.31 87.2997L202.312 87.3011L207.389 91.4116C207.389 91.4119 207.389 91.4121 207.389 91.4124C208.278 92.1372 209.611 91.9373 210.242 90.9795L218.283 78.77C218.868 77.8813 218.608 76.6968 217.71 76.127C216.817 75.5606 215.624 75.8109 215.043 76.6939L208.184 87.1094Z"
                fill="white" stroke="#316474"></path>
        </svg></span></div>`
        // rightBox.style.backgroundImage = url("./images/whatsapp_background.jpeg");
        // console.log(userAllChats);
    } catch (error) {
        this.window.location.href = 'login.html'
        console.log(error);
    }

});

const debouncedStopTyping = _.debounce(() => {
    const chatBoxBody = this.document.getElementById('chat-box-body');
    const currReciverId = chatBoxBody.getAttribute("userId");
    console.log("typing stoped");
    socket.emit('stopTyping', { recieverId: currReciverId });
}, 1000);

document.getElementById('chat-message').addEventListener('input', async () => {
    console.log("typing");
    const chatBoxBody = document.getElementById('chat-box-body');
    const currReciverId = chatBoxBody.getAttribute("userId");
    socket.emit('startTyping', { recieverId: currReciverId });
    debouncedStopTyping();
});

socket.on('userTyping', async ({ userId, typing, status }) => {
    const userStatus = document.getElementById('user-status');
    const chatBoxBody = document.getElementById('chat-box-body');
    const currReciverId = chatBoxBody.getAttribute("userId");
    console.log("curr recviever = ", currReciverId);
    console.log("incoming user = ", userId);
    if (currReciverId == userId) {
        if (typing) {
            userStatus.innerText = "typing...";
        }
        else {
            if (status === "Online")
                userStatus.innerText = status;
            else {
                userStatus.innerText = "";
                setTimeout(() => {
                    userStatus.innerText = convertToCustomFormat(status, true);
                }, 3000)
            }
        }
    }
})

document.getElementById('group-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    const multipleSelect = document.getElementById('multiple-select-field');
    const allUsers = await getAllUsers();
    console.log(allUsers);
    multipleSelect.innerHTML = "";
    allUsers.map(user => {
        var newOption = document.createElement("option");
        newOption.value = user.id;
        newOption.textContent = user.userName
        multipleSelect.appendChild(newOption);
    })
})


document.getElementById('private-chat-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    const multipleSelect = document.getElementById('users');
    console.log(multipleSelect.innerHTML);
    const allUsers = await getAllUsers();
    console.log(allUsers);
    multipleSelect.innerHTML = "<option selected>Select User</option>"
    allUsers.map(user => {
        var newOption = document.createElement("option");
        newOption.value = user.id;
        newOption.textContent = user.userName
        multipleSelect.appendChild(newOption);
    })
})


document.getElementById('create-group-btn').addEventListener('click', async (event) => {
    const groupName = document.getElementById('group-name');
    const inputFile = document.getElementById('group-image');
    const selectElement = document.getElementById('multiple-select-field');
    let selectedValues = Array.from(selectElement.selectedOptions);
    let formData = new FormData();
    formData.append('chatName', groupName.value);
    formData.append('isGroupChat', true);
    if (inputFile.files.length > 0) {
        formData.append('fileInput', inputFile.files[0]);
    }
    await Promise.all(
        selectedValues.map(item => {
            formData.append('users[]', (parseInt(item.value)));
        })
    )
    const groupDetails = await createGroupChat(formData);
    socket.emit('joinGroup', { groupId: groupDetails.id });
})


document.getElementById('create-chat-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const selectElement = document.getElementById('users');
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        console.log("option value = ", selectedOption.value);
        const chatDetails = {
            users: [parseInt(selectedOption.value)]
        }
        await createPrivateChat(chatDetails);
    } catch (error) {
        throw error;
    }
});

document.getElementById('update-profile-photo-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const inputFile = document.getElementById('user-profile-image');
        const fileId = document.getElementById('profile-image').getAttribute('fileId');
        var fileDetails = new FormData();
        fileDetails.append('fileId', fileId);
        if (inputFile.files.length > 0) {
            fileDetails.append('userProfilePhoto', inputFile.files[0]);
        }
        await updateUserProfilePhoto(fileDetails)
    } catch (error) {
        console.log(error);
    }
})

document.getElementById('profile-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const user = await getUserFromToken();
        console.log("user from token = ", user);
        const userDetails = await getUserDetails(user.userId);
        console.log("user details = ", userDetails);
        showUserProfile(userDetails);
    } catch (error) {
        console.log(error);
        throw error;
    }
})

document.getElementById('reciever-profile-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const chatBoxBody = document.getElementById('chat-box-body');
        const userId = chatBoxBody.getAttribute('userId');
        const userDetails = await getUserDetails(userId);
        showReciverProfile(userDetails);
    } catch (error) {
        console.log(error);
        throw error;
    }
});

document.getElementById('group-info-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const chatBoxBody = document.getElementById('chat-box-body');
        const chatId = chatBoxBody.getAttribute('chatId');
        const chatDetails = await getChatDetails(chatId);
        showGroupDetails(chatDetails);
    } catch (error) {
        console.log(error);
        throw error;
    }
});

function showGroupDetails(groupDetails) {
    const profileImageBox = document.getElementById('group-profile-image');
    profileImageBox.setAttribute('fileId', groupDetails.FileId);
    profileImageBox.innerHTML = `<img src="${groupDetails.profilePicture ? "http://localhost:4500/files/" + groupDetails.profilePicture : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}" class="img-fluid rounded-circle"  alt="my-image" width="70px" height="70px">`
    const groupDetailsBody = document.getElementById('group-details');
    const groupMembersList = document.getElementById('group-members-list');
    groupDetailsBody.innerHTML = `<label for="name"><h6>Group Name</h6></label>
            <p id="name" class="mb-2">${groupDetails.chatName}</p>
            <label for="email"><h6>Group Admin</h6></label>
            <p id="email" class="mb-2">${groupDetails.groupAdmin}</p>`
    console.log(groupDetails.Users);
    groupDetails.Users.map(user => {
        groupMembersList.innerHTML += `<li>${user.userName} - <span style="font-size: x-small;">${user.phoneNumber}</span></li>`
    })
}

function showUsers(users) {
    const people_list = document.getElementById('people-list');
    people_list.innerHTML = '';
    users.map(user => {
        people_list.innerHTML += `<div class="d-flex mb-2 id="list-item">
        <div>
            <img src="./images/my-image.jpeg" class="img-fluid rounded-circle" alt="my-image"
                width="70px" height="70px">
        </div>
        <div class="d-flex"
            style="margin-left: 15px; width: 100%; border-bottom: 1px solid #e9edef;">
            <div class="card-body mb-2">
                <h6 class="card-text" id="card-user-name">${user.userName}</h6>
                <p class="card-text" id="last-message">${user.last}</p>
            </div>
        </div>
    </div>`
    })
}

function showUserProfile(userDetails) {
    const profileImageBox = document.getElementById('user-profile-image');
    profileImageBox.setAttribute('fileId', userDetails.FileId);
    profileImageBox.innerHTML = `<img src="${userDetails.profilePicture ? "http://localhost:4500/files/" + userDetails.profilePicture : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}" class="img-fluid rounded-circle"  alt="my-image" width="70px" height="70px">`
    const userDetailsBody = document.getElementById('user-detail')
    userDetailsBody.innerHTML = `<label for="name">name</label>
            <h6 id="name" class="mb-2">${userDetails.userName}</h6>
            <label for="email">Email</label>
            <h6 id="email" class="mb-2">${userDetails.email}</h6>
            <label for="phoneNumber">Phone Number</label>
            <h6 id="phoneNumber" class="mb-2">${userDetails.phoneNumber}</h6>`
}

function showReciverProfile(userDetails) {
    const profileImageBox = document.getElementById('reciever-profile-image');
    profileImageBox.setAttribute('fileId', userDetails.FileId);
    profileImageBox.innerHTML = `<img src="${userDetails.profilePicture ? "http://localhost:4500/files/" + userDetails.profilePicture : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}" class="img-fluid rounded-circle"  alt="my-image" width="70px" height="70px">`
    const userDetailsBody = document.getElementById('reciever-detail')
    userDetailsBody.innerHTML = `<label for="name">name</label>
            <h6 id="name" class="mb-2">${userDetails.userName}</h6>
            <label for="email">Email</label>
            <h6 id="email" class="mb-2">${userDetails.email}</h6>
            <label for="phoneNumber">Phone Number</label>
            <h6 id="phoneNumber" class="mb-2">${userDetails.phoneNumber}</h6>`
}


async function getReceiverName(chatId) {
    console.log(chatId);
    const currUser = await getUserFromToken();
    const chatUsers = await getChatDetails(chatId);
    const receiver = chatUsers.Users.find(user => user.id !== currUser.userId);
    console.log('receiver = ', receiver);
    return receiver.userName;
}


async function showAllChats(chats) {
    const people_list = document.getElementById('people-list');
    people_list.innerHTML = '';
    chats.map(async (chat) => {
        let receiver;
        let profilePicture = null;
        if (!chat.isGroupChat) {
            const currUser = await getUserFromToken();
            const chatUsers = await getChatDetails(chat.id);
            receiver = chatUsers.Users.find(user => user.id !== currUser.userId);
            profilePicture = await getProfilePicture(receiver.id);
        }
        else {
            profilePicture = chat.profilePicture;
        }
        people_list.innerHTML += `<div class="d-flex mb-2 id="list-item" chat_id="${chat.id}">
        <div chat_id="${chat.id}">
            <img src="${profilePicture ? "http://localhost:4500/files/" + profilePicture : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}" class="img-fluid rounded-circle" alt="my-image"
                width="70px" height="70px" chat_id="${chat.id}">
        </div>
        <div class="d-flex"
            style="margin-left: 15px; width: 100%; border-bottom: 1px solid #e9edef;" chat_id="${chat.id}">
            <div class="card-body mb-2" chat_id="${chat.id}">
                <h6 class="card-text" id="card-user-name" chat_id="${chat.id}">${chat.isGroupChat ? chat.chatName : receiver.userName}</h6>
                <p class="card-text" id="last-message" style="font-size: small;" chat_id="${chat.id}">${chat.lastMessage ? chat.lastMessage : ''}</p>
            </div>
        </div>
    </div>`
    })
}

// document.querySelectorAll('#list-item').forEach(item => {
//     item.addEventListener('mouseover', (event) => {
//         event.target.style.cursor = 'pointer'
//     })
//     // item.style.cursor = 'pointer'
// })

document.getElementById('people-list').addEventListener('click', async function (event) {
    event.preventDefault();
    const chatId = event.target.getAttribute('chat_id');
    const chatMessages = await getChatMessages(chatId);
    const chatDetails = await getChatDetails(chatId);
    console.log("chat details: ", chatDetails);
    await showMessages(chatDetails, chatMessages);
})

function convertToCustomFormat(isoString, status = false) {
    const date = new Date(isoString);
    const today = new Date(); // Current date and time
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    if (status) {
        return "last seen today at " + date.toLocaleTimeString('en-US', options);
    }
    if (date.toDateString() === today.toDateString()) {
        // If the date is today, display "today" instead of the date
        return "today, " + date.toLocaleTimeString('en-US', options);
    } else {
        // Display the full date and time
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ", " +
            date.toLocaleTimeString('en-US', options);
    }
}

async function showMessages(chatDetails, chatMessages) {
    const demoBox = document.getElementById('demo-box');
    demoBox.style.display = 'none';
    const demoContent = document.getElementById('demo-content');
    demoContent.style.display = 'none';
    const rightBox = document.getElementById('right-box');
    rightBox.style.display = 'block';
    const chatImage = document.getElementById('chat-image');
    const chatName = document.getElementById('chat-name');
    const userStatus = document.getElementById('user-status');
    const chatBoxBody = document.getElementById('chat-box-body');
    const chatBox = document.getElementById('chat-box');
    document.getElementById('chat-message').value = "";
    let profilePicture = null;
    let chatTitle = null;
    console.log(chatDetails);
    let receiver = null;
    if (!chatDetails.isGroupChat) {
        document.getElementById('reciever-profile-btn').style.display = "block";
        document.getElementById('group-info-btn').style.display = "none";
        const currUser = await getUserFromToken();
        receiver = chatDetails.Users.find(user => user.id !== currUser.userId);
        profilePicture = await getProfilePicture(receiver.id);
        chatBoxBody.setAttribute('userId', receiver.id);
        document.getElementById('chat-message').setAttribute('recipientId', receiver.id);
        chatTitle = receiver.userName;
    }
    else {
        document.getElementById('reciever-profile-btn').style.display = "none";
        document.getElementById('group-info-btn').style.display = "block";
        profilePicture = chatDetails.profilePicture;
        chatTitle = chatDetails.chatName;
        chatBoxBody.setAttribute('userId', null);
        document.getElementById('chat-message').setAttribute('recipientId', null);
    }
    chatImage.innerHTML = `<img src="${profilePicture ? "http://localhost:4500/files/" + profilePicture : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}" class="img-fluid rounded-circle" alt="my-image"
    width="55px" height="55px">`
    chatName.innerText = chatTitle;
    if (receiver) {
        const userActivity = await getUserActivityStatus(receiver.id);
        if (userActivity && userActivity.status === "Online") {
            userStatus.innerText = userActivity.status;
        } else if (userActivity) {
            userStatus.innerText = convertToCustomFormat(userActivity.updatedAt, true);
        } else {
            userStatus.innerText = "";
        }
    } else {
        userStatus.innerText = "";
    }
    chatBoxBody.innerHTML = '';
    chatBoxBody.setAttribute("chatId", chatDetails.id);
    const currUser = await getUserFromToken();
    console.log(chatMessages);
    if (receiver)
        for (let i = 0; i < chatMessages.length; i++) {
            const message = chatMessages[i];
            if (message.senderId !== currUser.userId) {
                chatBoxBody.innerHTML += `<div class="d-flex justify-content-start mb-2" id="receiver">
                    <div id="receiver-msg">
                        <p class="m-2">${message.content}</p>
                        <div class="d-flex justify-content-end">
                            <span style="font-size: x-small;">${convertToCustomFormat(message.updatedAt)}</span>
                        </div>
                    </div>
                </div>`
            }
            else {
                chatBoxBody.innerHTML += `<div class="d-flex justify-content-end mb-2" id="sender">
                    <div id="sender-msg">
                        <p class="m-2">${message.content}</p>
                        <div class="d-flex justify-content-end">
                            <span style="font-size: x-small;">${convertToCustomFormat(message.updatedAt)}</span>
                        </div>
                    </div>
                </div>`
            }
        }
    else
        for (let i = 0; i < chatMessages.length; i++) {
            const message = chatMessages[i];
            const userDetails = await getUserDetails(message.senderId);

            if (message.senderId !== currUser.userId) {
                chatBoxBody.innerHTML += `<div class="d-flex justify-content-start mb-2" id="receiver">
                    <div id="receiver-msg">
                        <h6 style="color: rgb(76, 114, 76)">${userDetails.userName}</h6>
                        <p class="m-2">${message.content}</p>
                        <div class="d-flex justify-content-end">
                            <span style="font-size: x-small;">${convertToCustomFormat(message.updatedAt)}</span>
                        </div>
                    </div>
                    </div>`
            }
            else {
                chatBoxBody.innerHTML += `<div class="d-flex justify-content-end mb-2" id="sender">
                    <div id="sender-msg">
                        <h6 style="color: darkblue">you</h6>
                        <p class="m-2">${message.content}</p>
                        <div class="d-flex justify-content-end">
                            <span style="font-size: x-small;">${convertToCustomFormat(message.updatedAt)}</span>
                        </div>
                    </div>
                    </div>`
            }
        }
    chatBox.scrollTop = chatBox.scrollHeight;

}

document.getElementById('people-list').addEventListener('mouseover', function (event) {
    event.target.style.cursor = 'pointer';
})

document.querySelectorAll('#list-item').forEach(item => {
    item.addEventListener('click', (event) => {
        console.log(item);
    })
})







