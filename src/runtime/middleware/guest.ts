import { defineNuxtRouteMiddleware, useRuntimeConfig } from '#app';
import { useAuth } from '../composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth();
    const options = useRuntimeConfig().public.authJWT;

    if (auth.isLogged) return options.homePage;
});