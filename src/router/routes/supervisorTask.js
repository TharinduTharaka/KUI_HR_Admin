export default[
    {
        path: '/apps/supervisorTask',
        name: 'apps-supervisorTask',
        component: () => import('@/views/supervisorTask/vue-good-table/GoodTable.vue'),
        meta: {
            pageTitle: 'Supervisor Task',
        },
    },
    {
        path: '/apps/supervisorTask/createMyTask',
        name: 'createMyTask',
        component: () => import('@/views/myTask/createMyTask'),
        meta: {
            pageTitle: 'Create My Task',
        },
    },
    {
        path: '/apps/supervisorTask/editSupervisorTask/:task_id/:user_id',
        name: 'editSupervisorTask',
        component: () => import('@/views/supervisorTask/editSupervisorTask'),
        meta: {
            pageTitle: 'Edit Supervisor Task',
        },
    },
]
