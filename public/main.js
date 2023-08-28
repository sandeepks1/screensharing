let peerConnection = new RTCPeerConnection({
    iceServers: [{
            urls: "stun:stun.relay.metered.ca:80",
        },
        {
            urls: "turn:a.relay.metered.ca:80",
            username: "835c5389b98d89346569c234",
            credential: "TFEyZVKp00MJOBNJ",
        },
        {
            urls: "turn:a.relay.metered.ca:80?transport=tcp",
            username: "835c5389b98d89346569c234",
            credential: "TFEyZVKp00MJOBNJ",
        },
        {
            urls: "turn:a.relay.metered.ca:443",
            username: "835c5389b98d89346569c234",
            credential: "TFEyZVKp00MJOBNJ",
        },
        {
            urls: "turn:a.relay.metered.ca:443?transport=tcp",
            username: "835c5389b98d89346569c234",
            credential: "TFEyZVKp00MJOBNJ",
        },
    ],
});
let localStream;
let remoteStream;

let init = async() => {

    try {
        localStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: "always"
            },
            audio: false
        });
    } catch (ex) {
        console.log("Error occurred", ex);
    }
    remoteStream = new MediaStream()
        // document.getElementById('user-1').srcObject = localStream
    document.getElementById('user-2').srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
        //document.getElementById("connection").display = "none";
        openFullscreen()
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };
}

let createOffer = async() => {


    peerConnection.onicecandidate = async(event) => {
        //Event that fires off when a new offer ICE candidate is created
        if (event.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
}

let createAnswer = async() => {

    let offer = JSON.parse(document.getElementById('offer-sdp').value)

    peerConnection.onicecandidate = async(event) => {
        //Event that fires off when a new answer ICE candidate is created
        if (event.candidate) {
            console.log('Adding answer candidate...:', event.candidate)
            document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }
    };

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
}

let addAnswer = async() => {
    console.log('Add answer triggerd')
    let answer = JSON.parse(document.getElementById('answer-sdp').value)
    console.log('answer:', answer)
    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
    }
}
init()

document.getElementById('create-offer').addEventListener('click', createOffer)
    // document.getElementById('create-answer').addEventListener('click', createAnswer)
document.getElementById('add-answer').addEventListener('click', addAnswer)

function openFullscreen() {
    var elem = document.getElementById("user-2");

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}