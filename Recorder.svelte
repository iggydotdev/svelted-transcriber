<script>
  import { onMount } from "svelte";
  import Logo from "./Logo.svelte";
  import Share from "./Share.svelte";

  let dirty = false;
  let isRunning = false;
  let speechRecognition = null;
  let innerText = null;

  const speechRecognitionSetup = () => {
    console.log("Setting everything up!");
    speechRecognition = !!window.SpeechRecognition
      ? new window.SpeechRecognition()
      : new window.webkitSpeechRecognition();

    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";
    speechRecognition.continous = false;
    let newParagraph = document.createElement("p");

    speechRecognition.onsoundstart = e => {
      console.info(`The wind whispers me something...`, e);
    };

    speechRecognition.onsoundend = e => {
      console.info(`It seems it has stopped.`, e);
    };

    speechRecognition.onstart = e => {
      console.info(`Starting speechRecognition`, e);
    };

    speechRecognition.onend = e => {
      if (isRunning) {
        speechRecognition.start();
      }
    };

    speechRecognition.onresult = e => {
      let chunk = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join("");
      newParagraph.textContent = chunk;
      if (e.results[0].isFinal) {
        newParagraph = document.createElement("p");
        newParagraph.setAttribute("contenteditable", true);
        document.querySelector("#text").appendChild(newParagraph);
      }
    };
  };

  const toggle = () => {
    if (!isRunning) {
      isRunning = true;
      speechRecognition.start();
    } else {
      dirty = document.querySelector("#text").innerText !== "";
      isRunning = false;
      speechRecognition.stop();
    }
  };

  const reset = () => {
    document.querySelector("#text").innerHTML = "";
    dirty = false;
  };

  const download = () => {
    innerText = document.querySelector("#text").innerText;
    textFileAsBlob = new Blob([innerText], {
      type: "text/plain"
    });
    let fileNameToSaveAs = "summary.txt";
    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Hidden Link";
    downloadLink.setAttribute("class", "vh");
    window.URL = window.URL || window.webkitURL;
    console.log(textFileAsBlob);
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    document.forms.transcription.appendChild(downloadLink);
    downloadLink.onclick = document.forms.transcription.removeChild(downloadLink);
    downloadLink.style.display = "none";
    downloadLink.click();
  };

  const setup = () => {
    speechRecognitionSetup();
  };

  onMount(() => {
    setup();
  });
</script>




<h1>Transcriber</h1>
<Logo w="24" h="24" />
<!-- <Share fn={()=>{console.log}} id={'twitter'} label={'Tweet this'}, iconName={'logo-twitter'} /> -->

<form id="transcription">
  <div id="text"></div>
  
    <button 
      type="button"
      on:click={toggle}
    >
      <span id={isRunning? 'stop':'start'}>
        <span class="vh">
          {isRunning? "Stop" : "Start"}
        </span>
      </span>
    </button>
    {#if dirty}
      <button type="button" on:click={download}>
        <span id="download"></span>
        <span class="vh">Download</span>
      </button>
      <button type="button" on:click={reset}>
       <span id="reset"></span>
       <span class="vh">Reset</span>
      </button>
    {/if}
</form>




<style>
  .vh {
    visibility: hidden;
    display: none;
  }

  button {
    position: relative;
    height: 32px;
    width: 32px;
    background: white;
    border: none;
    cursor: pointer;
  }

  #start,
  #stop,
  #download,
  #reset {
    position: absolute;
    top: calc(50% - 16px);
    left: calc(50% - 16px);
    width: 32px;
    height: 32px;
  }

  #start::after,
  #stop::after,
  #download::after,
  #reset::after {
    width: 32px;
    height: 32px;
  }
  #start::after {
    content: url("https://unpkg.com/ionicons@5.4.0/dist/svg/play-outline.svg");
  }
  #stop::after {
    content: url("https://unpkg.com/ionicons@5.4.0/dist/svg/stop-outline.svg");
  }
  #download::after {
    content: url("https://unpkg.com/ionicons@5.4.0/dist/svg/download-outline.svg");
  }
  #reset::after {
    content: url("https://unpkg.com/ionicons@5.4.0/dist/svg/refresh-outline.svg");
  }
</style>

