<?php

if (empty($_GET['action'])) {
    return json_encode([]);
}

require '../src/server/api.php';

$routing = new Routing();
$exec = $routing->func;
$exec();

class Routing {
    private string $route;
    public string $func;

    function __construct() {
        $this->route = $_GET['action'];
        $this->setFunc();
    }

    private function setFunc() {
        switch ($this->route) {
            case 'cad_cat':
                $this->func = 'cadastrarCategoria';
                break;
            case 'list_cat':
                $this->func = 'listarCategorias';
                break;
            case 'list_cc':
                $this->func = 'listarContas';
                break;
            case 'cad_cc':
                $this->func = 'cadastrarConta';
                break;
        }
    }
}

?>