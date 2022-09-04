import axios from "axios"

export async function isLoggedIn() {
    const response = await axios({
        method: 'GET',
        url: '/checkLogState'
    })
    return response.data.result === 'bad' ? false : true;
}

export async function logIn() {
    const response = await axios({
        method: "GET",
        url: "/login"
    })
    return response.data;
}

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append(
        "Image",
        file,
        'Image.jpg'
    );
    const response = await axios.post("/uploadFile", formData)
    return response.data
}

export async function getTracks() {
    const response = await axios({
        method: "GET",
        url: "/getTracks"
    })
    return response.data;
}