import { Home, Film, Search, Settings } from 'lucide-vue-next';

export const nav = [
    {
        'name': 'Home',
        'route': '/',
        'content': Home,
        'separator': true
    },
    {
        'name': 'Reels',
        'route': '/reels',
        'content': Film,
        'separator': true
    },
    {
        'name': 'Search',
        'route': '/search',
        'content': Search,
        'separator': true
    },
    {
        'name': 'Settings',
        'route': '/settings',
        'content': Settings,
        'separator': false
    }
]