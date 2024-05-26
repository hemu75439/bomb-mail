import type { Component } from 'vue'
import { Home, ListTodo, Settings } from 'lucide-vue-next';

interface Navigation {
    name: string;
    route: string;
    content: Component;
    separator: boolean;
}

export const nav: Navigation[] = [
    {
        'name': 'Home',
        'route': '/',
        'content': Home,
        'separator': true,
    },
    {
        'name': 'Tasks',
        'route': '/tasks',
        'content': ListTodo,
        'separator': true
    },
    {
        'name': 'Settings',
        'route': '/settings',
        'content': Settings,
        'separator': false
    }
]