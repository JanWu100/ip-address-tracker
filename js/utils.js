const setOutputHeight = () => {
    const root = document.querySelector(":root");
    const outputHeight = document.querySelector(".output").clientHeight;
    root.style.setProperty("--output-height", `${outputHeight / 2}px`);
  };
  
  setOutputHeight();
  
  window.addEventListener("resize", () => {
    setOutputHeight();
  });