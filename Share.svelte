<script>
  import { onMount } from "svelte";
  export let fn, id, label, iconName;
  let tweet = "";
  let styledBtn = `
                            position: absolute;
                            top: calc(50% - 16px);
                            left: calc(50% - 16px);
                            width: 32px;
                            height: 32px;
                          `;

  onMount(() => {
    const styleTag = document.createElement("style");
    styleTag.setAttribute("id", `${id}_style_tag`);
    styleTag.innerHTML = `#${id}::after {
                              content: url("https://unpkg.com/ionicons@5.4.0/dist/svg/${iconName}.svg");
                            }`;
    document.body.appendChild(styleTag);
    let sc = document.createElement("script");
    sc.setAttribute("async", true);
    sc.setAttribute("src", "https://platform.twitter.com/widgets.js");
    sc.setAttribute("charset", "utf-8");
    document.body.appendChild(sc);

    //  tweet = document.querySelector("#text").innerText;
  });
</script>


<!-- <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-text={tweet} data-show-count="false">Tweet</a> -->

<button type="button" on:click={fn}>
  <span id={id} style={styledBtn}></span>
  <span class="vh">{label}</span>
</button>

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
    cursor: "pointer";
  }
</style>