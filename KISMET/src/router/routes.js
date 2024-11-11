const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "", 
        component: () => import("pages/DashBoardPage.vue"),
      },
      {
        path: "compra",
        component: () => import("pages/CompraPage.vue"),
      },
      {
        path: "relatorio-compra", 
        component: () => import("pages/CompraRelatorio.vue"),
      },
      {
        path: "adicionar-compra", 
        component: () => import("pages/CompraAdd.vue"),
      },
      {
        path: "venda",
        component: () => import("pages/VendaPage.vue"),
      },
      {
        path: "relatorio-venda", 
        component: () => import("pages/VendaRelatorio.vue"),
      },
      {
        path: "adicionar-venda", 
        component: () => import("pages/VendaAdd.vue"),
      },
      {
        path: "produto",
        component: () => import("pages/ProdutoPage.vue"),
      },
      {
        path: "adicionar-produto", 
        component: () => import("pages/ProdutoAdd.vue"),
      },
      {
        path: "pagamento",
        component: () => import("pages/PagamentoPage.vue"),
      },
      {
        path: "adicionar-pagamento", 
        component: () => import("pages/PagamentoAdd.vue"),
      },
      {
        path: "cliente",
        component: () => import("pages/ClientePage.vue"),
      },
      {
        path: "adicionar-cliente", 
        component: () => import("pages/AddClient.vue"),
      },
      {
        path: "fornecedor",
        component: () => import("pages/FornecedorPage.vue"),
      },
      {
        path: "adicionar-fornecedor", 
        component: () => import("pages/FornecedorAdd.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
