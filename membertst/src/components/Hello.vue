
<template>
  <div class="Hello">
    <h1>Welcome to T9 GAMING</h1>
  </div>
</template>

<script>
export default {
  name: "Hello",
  data() {
    return {
      firstLogin: false
    };
  },
  mounted() {
    this.$store.state.showNav = 0;
    this.checkFirstLogin();
  },
  methods: {
    checkFirstLogin() {
      let dbFirstLogin = sessionStorage.getItem("firstLogin");
      if (dbFirstLogin.match("true")) {
        this.firstLogin = true;
      } else {
        this.firstLogin = false;
      }
      this.turnPage(this.firstLogin);
    },
    turnPage(value) {
      if (value) {
        this.$router.push({ path: "/FirstPassword" });
      } else {
        return;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Hello {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(240, 248, 255, 0.877);
  min-height: 100vh;
  text-align: center;
}
</style>
