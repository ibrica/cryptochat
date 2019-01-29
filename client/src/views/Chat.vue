<template>
  <div id="template" >
    <div id="videos">
      <video id="mini-video" autoplay playsinline muted></video>
      <video id="remote-video" autoplay playsinline></video>
      <video id="local-video" autoplay playsinline muted></video>
    </div>
    <footer>
      <div id="sharing-div">
        <div id="room-link">Waiting for other peers to join this room:
          <a id="room" :href="$route.params.room" target="_blank">{{ $route.params.room }}</a>
        </div>
      </div>
      <div id="status-div"></div>
      <div id="rejoin-div" class="hidden">
        <span>You have left the call.</span>
        <button id="rejoin-button">REJOIN</button>
        <button id="new-room-button">NEW ROOM</button>
      </div>
    </footer>

    <div id="icons" :class="[iconsHidden?'hidden':'active']">
      <svg
        id="mute-audio"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="-10 -10 68 68"
        :click="toggleAudioMute"
      >
        <title>title</title>
        <circle cx="24" cy="24" r="34">
          <title>Mute audio</title>
        </circle>
        <path
          class="on"
          transform="scale(0.6), translate(17,18)"
          d="M38 22h-3.4c0 1.49-.31 2.87-.87 4.1l2.46 2.46C37.33 26.61 38 24.38 38 22zm-8.03.33c0-.11.03-.22.03-.33V10c0-3.32-2.69-6-6-6s-6 2.68-6 6v.37l11.97 11.96zM8.55 6L6 8.55l12.02 12.02v1.44c0 3.31 2.67 6 5.98 6 .45 0 .88-.06 1.3-.15l3.32 3.32c-1.43.66-3 1.03-4.62 1.03-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c1.81-.27 3.53-.9 5.08-1.81L39.45 42 42 39.46 8.55 6z"
          fill="white"
        ></path>
        <path
          class="off"
          transform="scale(0.6), translate(17,18)"
          d="M24 28c3.31 0 5.98-2.69 5.98-6L30 10c0-3.32-2.68-6-6-6-3.31 0-6 2.68-6 6v12c0 3.31 2.69 6 6 6zm10.6-6c0 6-5.07 10.2-10.6 10.2-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c6.56-.97 12-6.61 12-13.44h-3.4z"
          fill="white"
        ></path>
      </svg>
      
      <svg
        id="mute-video"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="-10 -10 68 68"
        :click="toggleVideoMute"
      >
        <circle cx="24" cy="24" r="34">
          <title>Mute video</title>
        </circle>
        <path
          class="on"
          transform="scale(0.6), translate(17,16)"
          d="M40 8H15.64l8 8H28v4.36l1.13 1.13L36 16v12.36l7.97 7.97L44 36V12c0-2.21-1.79-4-4-4zM4.55 2L2 4.55l4.01 4.01C4.81 9.24 4 10.52 4 12v24c0 2.21 1.79 4 4 4h29.45l4 4L44 41.46 4.55 2zM12 16h1.45L28 30.55V32H12V16z"
          fill="white"
        ></path>
        <path
          class="off"
          transform="scale(0.6), translate(17,16)"
          d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm-4 24l-8-6.4V32H12V16h16v6.4l8-6.4v16z"
          fill="white"
        ></path>
      </svg>
      
      <svg
        id="fullscreen"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="-10 -10 68 68"
        :click="toggleFullscreen"
      >
        <circle cx="24" cy="24" r="34">
          <title>Enter fullscreen</title>
        </circle>
        <path
          class="on"
          transform="scale(0.8), translate(7,6)"
          d="M10 32h6v6h4V28H10v4zm6-16h-6v4h10V10h-4v6zm12 22h4v-6h6v-4H28v10zm4-22v-6h-4v10h10v-4h-6z"
          fill="white"
        ></path>
        <path
          class="off"
          transform="scale(0.8), translate(7,6)"
          d="M14 28h-4v10h10v-4h-6v-6zm-4-8h4v-6h6v-4H10v10zm24 14h-6v4h10V28h-4v6zm-6-24v4h6v6h4V10H28z"
          fill="white"
        ></path>
      </svg>
      
      <svg
        id="hangup"
        :class="[hangupHidden?'hidden':'']"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="-10 -10 68 68"
        :click="toggleFullscreen"
      >
        <circle cx="24" cy="24" r="34">
          <title>Hangup</title>
        </circle>
        <path
          transform="scale(0.7), translate(11,10)"
          d="M24 18c-3.21 0-6.3.5-9.2 1.44v6.21c0 .79-.46 1.47-1.12 1.8-1.95.98-3.74 2.23-5.33 3.7-.36.35-.85.57-1.4.57-.55 0-1.05-.22-1.41-.59L.59 26.18c-.37-.37-.59-.87-.59-1.42 0-.55.22-1.05.59-1.42C6.68 17.55 14.93 14 24 14s17.32 3.55 23.41 9.34c.37.36.59.87.59 1.42 0 .55-.22 1.05-.59 1.41l-4.95 4.95c-.36.36-.86.59-1.41.59-.54 0-1.04-.22-1.4-.57-1.59-1.47-3.38-2.72-5.33-3.7-.66-.33-1.12-1.01-1.12-1.8v-6.21C30.3 18.5 27.21 18 24 18z"
          fill="white"
        ></path>
      </svg>
    </div>
  </div>
</template>
<style>
@import "../assets/styles/site.css";
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component} from 'vue-property-decorator'
  import io from 'socket.io-client';
  import Peer from 'simple-peer';
  //import Debug from 'debug';
  //const  debug = Debug('client');

  const debug = console.log;


  @Component
  export default class Chat extends Vue {
    iconsHidden: boolean = true;
    hangupHidden: boolean = true;
    constructor(){
      super();
      this.chat();
    }

    /**
     * Show video stream
     * mode - string (L - Local, R - Remote)
     * stream - MediaStream to show
     */
    showVideo(mode: string, stream: MediaStream){ 
      const localVideo: HTMLVideoElement | null  = document.querySelector('#local-video');
      if(mode==='L'){
          if (localVideo && stream) {
            localVideo.srcObject = stream;
            this.hideIcons(false);
          }
      } else {
            // got remote video stream, now let's show it in a video tag
            const remoteVideo:HTMLVideoElement | null  = document.querySelector('#remote-video');
            // not supported now window.URL.createObjectURL(stream), newer browser
            remoteVideo.srcObject = stream;
            /*remoteVideo.play()
                      .catch(_=>{}); // Chrome autoplay policy
            */
           const miniVideo:HTMLVideoElement | null  = document.querySelector('#mini-video');
           miniVideo.srcObject = localVideo.srcObject;  
           this.hangupHidden = false;
      }
    }

    toggleAudioMute (): void {

    }

    toggleVideoMute (): void {

    }

    toggleFullscreen (): void {
      
    }

    hangup (): void {
      this.hangupHidden = true;
    }

    hideIcons(flag: boolean) {
      this.iconsHidden = flag;
    }

    activate(element: HTMLElement){
      element.classList.add('active');
    }

    deactivate(element: HTMLElement){
      element.classList.remove('active');
    }

    toggle(element: HTMLElement){
      element.classList.contains('on') ? element.classList.remove('on') : element.classList.add('on');
    }

    async chat() {
        const socket = io('localhost:3000');
        
        const useTrickle: boolean = true; // Use trickle default
        const peers: Peer.Instance[] = [];

        // Take a name of room from URL, trim leading slash and ignore path behind secod slash
        const path: string = window.location.pathname.slice(1);
        const slash2Index: number = path.indexOf('/');
        const room = slash2Index < 0 ? path : path.slice(0, slash2Index);

        // Try to show local video
        let localStream: MediaStream;
        try {
            localStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
          });
          debug('Playing local stream.');
          this.showVideo('L', localStream);

        } catch (error){
          debug('getUserMedia() error: ' + error.name);
        }
        
        if (room !== '') {
          // Create or join room
          socket.emit('join', room);
          debug('Attempted to create or join room', room);
        }

        socket.on('connect', () => {
          debug('Connected to signalling server, Peer ID: %s', socket.id);
        });

        socket.on('full', (r: string) => {
          debug('Can\'t join room  %s, two participants max!', r);
        });

        socket.on('peer', (peerData: any) => {
          const peerId: number = peerData.peerId;
          const peer = new Peer({ initiator: peerData.initiator, trickle: useTrickle , stream:localStream});

          debug('Peer available for connection discovered from signalling server, Peer ID: %s', peerId);

          // Catching signal event from socket.io server
          socket.on('signal', (data) => {
            if (data.peerId === peerId) { // If not true this is not my room partner
              debug('Received signalling data', data, 'from Peer ID:', peerId);
              peer.signal(data.signal);
            }
          });

          socket.on('log', (array) => {
            debug(array);
          });

          peer.on('signal', (data) => {
            debug('Advertising  signalling data', data, 'to Peer ID:', peerId);
            socket.emit('signal', {
              signal: data,
              peerId,
            });
          });

          peer.on('error', (e) => {
            debug('Error sending connection to peer %s:', peerId, e);
          });

          peer.on('connect', () => {
            debug('Peer connection established');
            peer.send("hey peer");
          });

          peer.on('data', (data) => {
            debug('Recieved data from peer:', data);
          });

          peer.on('stream', (stream) => {
            debug('video stream received');
            this.showVideo('R', stream);
          });
          // Remember peers in the list though only one on one is allowed
          peers[peerId] = peer;
        });
    }
};
</script>

