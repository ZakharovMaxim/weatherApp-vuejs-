<template>
  <div class="form-wrap" :class='isActiveWidget ? "active" : ""'>
    <div class="form">
      <input type="text" autofocus @focus="isActivePlaceholder = true" @blur="isActivePlaceholder = false" v-model='searchStr' @keyup.enter="search">
      <a href="" @click.prevent="search">Найти</a>
      <div class="form__placeholder"
           @click="focusForm"
           :class='{
             "active" : isActivePlaceholder || searchStr.length != 0,
             "error":error }'
             @animationend="error = false">
       Введите населенный пункт
     </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'myForm',
  data () {
    return {
      isActivePlaceholder: false,
      searchStr: '',
      error: false
    }
  },
  props: ['isActiveWidget'],
  methods: {
    focusForm() {
      document.querySelector('.form > input').focus();
    },
    search(e) {
      if(!this.searchStr.length) {
        this.error = true;
        return false;
      }
      this.$emit('pressed', this.searchStr);
    }
  }
}
</script>

<style scoped>
.form-wrap {
  width: 980px;
  height: 46px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -23px;
  margin-left: -490px;
  transition: top .5s linear;
}
.form-wrap.active {
  top: 60px;
  margin-top: 0;
}
.form{
  width: 100%;
  height: 100%;
  position: relative;
}
.form > input {
  width: 70%;
  float: left;
  border: 0;
  outline: none;
  padding: 15px 10px;
}
.form > a {
  width: 30%;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  user-select: none;
  background: rgb(212,75,56);
  padding: .85em 1.5em;
  color: #fff;
  float: left;
}
.form > a:hover {background:  rgb(232,95,76);}
.form > a:active {background:  rgb(152,15,0);}
.form > .form__placeholder {
  position: absolute;
  top: 38%;
  left: 1%;
  transition: all .5s ease;
  color: #999;
}
.form > .form__placeholder.active {
  top: -45%;
  color: #000;
}
.form__placeholder.error {
  animation: emptyString .1s linear alternate;
  animation-iteration-count: 3;
  color: #ff0033;
}
@keyframes emptyString {
  0% {
    transform: rotateZ(2deg);
  }
  100% {
    transform: rotateZ(-2deg);

  }
}
</style>
