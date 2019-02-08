import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Chat from './views/Chat.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:room',
      name: 'Chat',
      component: Chat,
    },/*
    {
      path: '/r/:room',
      name: 'Chat',
      component: Chat,
    }, */
  ],
});
