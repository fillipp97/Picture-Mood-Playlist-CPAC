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

export async function getRecommendedSongs(imageStepResults) {
    const formData = new FormData();
    formData.append('mood', imageStepResults.mood)
    formData.append('moodLLF', imageStepResults.moodLLF)
    formData.append('objects', imageStepResults.objects)
    formData.append('genresSeed', imageStepResults.genresSeed)
    formData.append('artistsSeed', imageStepResults.artistsSeed)
    formData.append('tracksSeed', imageStepResults.tracksSeed)

    const response = await axios.post("/getSongs", formData)
    return response.data
}