<template>
  <div id="intersectionObserverDiv"></div>
</template>
<script>
export default {
  name: "IntersectionObserver",
  props: {
    callback: {
      type: Function
    }
  },
  data() {
    return {
      observer: null
    };
  },
  unmounted() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  mounted() {
    let options = {
      root: document,
      rootMargin: "200px",
      threshold: 0.1
    };

    let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.callback();
        }
      });
    }, options);

    observer.observe(document.getElementById("intersectionObserverDiv"));

    this.observer = observer;
  }
};
</script>
