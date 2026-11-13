topics.push("Árboles generales", "Listas y recursión", "Diseño y complejidad");

const general = (nodes, label = "Árbol general") => ({nodes,label});
const familia = general([[1,200,28],[2,85,83,0],[3,200,83,0],[4,315,83,0],[5,43,142,1],[6,126,142,1],[7,228,142,2],[8,200,200,6]]);
const carpetas = general([["raíz",200,28],["docs",80,85,0],["tmp",200,85,0],["src",320,85,0],["curso",80,145,1]]);
const mayores = general([[8,210,28],[3,105,78,0],[9,325,78,0],[1,48,128,1],[7,164,128,1],[4,113,178,4],[6,160,228,5]],"ABB");
function coding(topic,title,lesson,prompt,visual,criteria,ideal,after,source,tests) {
  exercise(topic,3,title,lesson,prompt,visual,criteria,ideal,after);
  Object.assign(questions.at(-1),{source,tests});
}

coding(5,"Copiar hasta el nivel k","Seguí pH para bajar un nivel y sH para avanzar en el mismo nivel.","Implementá ArbGen copiaParcial(ArbGen A, unsigned int k). Copiá hasta el nivel k inclusive. La raíz está en nivel 1. Un árbol vacío o k == 0 devuelve NULL. Usá dato, pH y sH. No compartas memoria ni uses auxiliares.",familia,
["Corta con árbol vacío o k igual a cero","Reserva un nodo nuevo y copia su dato","Pasa k - 1 al primer hijo y k al siguiente hermano","Devuelve el árbol nuevo sin compartir nodos"],
`ArbGen copiaParcial(ArbGen A, unsigned int k) {
    if (A == NULL || k == 0) {
        return NULL;
    }
    ArbGen copia = new nodoArbGen;
    copia->dato = A->dato;
    copia->pH = copiaParcial(A->pH, k - 1);
    copia->sH = copiaParcial(A->sH, k);
    return copia;
}`,general(familia.nodes.slice(0,4)),"Foto de clase · copiaParcial",[
["Árbol de la figura con k = 2","Raíz 1 con hijos 2, 3 y 4."],["k = 0","NULL."],["k = 1","Solo la raíz. Cambiar el dato en la copia no cambia el original."]]);

coding(5,"Borrar un directorio hoja","El siguiente hermano queda en el mismo nivel. Al borrar hay que conservar esa cadena.","Implementá void borrar(Directorios &D, char *nom_dir). Usá strEq y los campos nombre, pH y sH de nodoDir. Solo borrá si el directorio existe y carece de subdirectorios. Los nombres son únicos y cada nodo posee su nombre reservado con new[]. Suponé que nom_dir es una cadena externa al árbol. Evitá auxiliares.",carpetas,
["Protege el caso vacío y compara con strEq","Borra únicamente si pH es NULL","Actualiza por referencia el enlace al siguiente hermano y libera nombre y nodo","Busca por primer hijo y siguiente hermano"],
`void borrar(Directorios &D, char *nom_dir) {
    if (D != NULL) {
        if (strEq(D->nombre, nom_dir)) {
            if (D->pH == NULL) {
                Directorios viejo = D;
                D = D->sH;
                delete[] viejo->nombre;
                delete viejo;
            }
        } else {
            borrar(D->pH, nom_dir);
            borrar(D->sH, nom_dir);
        }
    }
}`,general([carpetas.nodes[0],carpetas.nodes[1],carpetas.nodes[3],carpetas.nodes[4]]),"Ejercicio 3 · Directorios",[
["Borrar tmp","La raíz conserva docs y src en ese orden."],["Borrar docs","El árbol queda igual porque docs tiene un hijo."],["Borrar la única raíz","D queda en NULL."]]);

coding(4,"Copiar solo los mayores","Si la raíz es menor o igual al límite, su subárbol izquierdo también se descarta.","Implementá ABB copiarMayores(ABB A, int x), con nodoABB y campos dato, izq y der. Conservá solo claves estrictamente mayores que x, sin memoria compartida ni auxiliares. Podá donde se pueda. Peor caso O(n). El ejemplo usa x = 5.",mayores,
["Devuelve NULL para un árbol vacío","Omite la izquierda y la raíz si dato <= x","Crea un nodo independiente y conecta ambas copias si dato > x","Conserva el orden del ABB y visita cada nodo como máximo una vez"],
`ABB copiarMayores(ABB A, int x) {
    if (A == NULL) {
        return NULL;
    }
    if (A->dato <= x) {
        return copiarMayores(A->der, x);
    }
    ABB copia = new nodoABB;
    copia->dato = A->dato;
    copia->izq = copiarMayores(A->izq, x);
    copia->der = copiarMayores(A->der, x);
    return copia;
}`,general([[8,200,28],[7,108,85,0],[9,300,85,0],[6,58,143,1]],"ABB"),"Ejercicio 2 · copiarMayores",[
["Ejemplo con x = 5","Raíz 8, hijo izquierdo 7 con hijo izquierdo 6, e hijo derecho 9."],["x = 8","Solo queda 9."],["x = 9 o árbol vacío","NULL."]]);

coding(1,"Imprimir los k más antiguos","Los elementos antiguos están en el fondo. Una pila auxiliar invierte el orden temporalmente.","Escribí void imprimirKAntiguos(int k, Pila p) de forma iterativa, con k positivo. Imprimí los k más antiguos de más antiguo a más reciente y restaurá p. Usá crearPila(), apilar(int, Pila), cima(Pila), desapilar(Pila), esVaciaPila(Pila) y destruirPila(Pila &). Apilar y desapilar modifican el TAD y devuelven su manejador.",line([11,9,7,5,3],"Pila"),
["Usa solo el TAD y nunca consulta la cima de una pila vacía","Invierte el orden pasando todos los elementos a una pila auxiliar","Imprime a lo sumo k en el orden pedido y devuelve todos a p","Destruye la auxiliar y contempla pila vacía o k mayor al tamaño"],
`void imprimirKAntiguos(int k, Pila p) {
    Pila aux = crearPila();
    while (!esVaciaPila(p)) {
        aux = apilar(cima(p), aux);
        p = desapilar(p);
    }
    int impresos = 0;
    while (!esVaciaPila(aux)) {
        int dato = cima(aux);
        aux = desapilar(aux);
        if (impresos < k) {
            printf("%d ", dato);
            impresos++;
        }
        p = apilar(dato, p);
    }
    destruirPila(aux);
}`,line([3,5,7],"Orden de salida"),"Problema 1 · TAD Pila",[
["Figura con k = 3","Imprime 3 5 7. La cima de p vuelve a ser 11."],["k = 9","Imprime 3 5 7 9 11 y restaura p."],["Pila vacía","No imprime valores."]]);

const expresion = general([["+",200,28],["−",100,84,0],["*",296,84,0],["+",85,141,1],["2",244,141,2],["y",344,141,2],["x",43,200,3],["3",132,200,3]],"Árbol binario");
coding(1,"Imprimir hojas por nivel","En un recorrido por niveles, la cola conserva el orden de llegada.","Implementá void hojasPorNivel(AB a). Cada nodo guarda const char *dato y los hijos izq y der. Imprimí solo las hojas por nivel, de izquierda a derecha dentro del nivel. Usá crearCola(), encolar(Cola &, AB), desencolar(Cola &), esVaciaCola(Cola) y destruirCola(Cola &). Desencolar devuelve el primer nodo.",expresion,
["Contempla árbol vacío y encola la raíz","Extrae por FIFO y encola los hijos existentes de izquierda a derecha","Imprime solamente nodos con ambos hijos NULL","Libera la cola sin liberar nodos del árbol"],
`void hojasPorNivel(AB a) {
    if (a != NULL) {
        Cola c = crearCola();
        encolar(c, a);
        while (!esVaciaCola(c)) {
            AB actual = desencolar(c);
            if (actual->izq == NULL && actual->der == NULL) {
                printf("%s ", actual->dato);
            }
            if (actual->izq != NULL) {
                encolar(c, actual->izq);
            }
            if (actual->der != NULL) {
                encolar(c, actual->der);
            }
        }
        destruirCola(c);
    }
}`,line([2,"y","x",3],"Orden de salida"),"Foto de pizarra · adaptación de hojasPorNivel",[
["Árbol de la figura","Imprime 2 y x 3."],["Solo la raíz","Imprime el dato de la raíz."],["Árbol vacío","No imprime valores."]]);

coding(0,"Diseñar Multiset con mínimo O(1)","El ABB concentra multiplicidades. La representación puede guardar datos que eviten recorrerlo en consultas frecuentes.","Para claves 1..K y n > 0 en insertar, definí Nodo y RepMultiset e implementá crear(), insertar(Multiset &m, int x, int n) y min(Multiset m). min exige un multiset no vacío. crear, min y cantidad deben poder resolverse en O(1), y las búsquedas e inserciones en O(altura). Usá O(d) espacio para d claves distintas. Explicá en un comentario qué mantener al eliminar la última ocurrencia del mínimo.",tree(["5 × 2","3 × 1","8 × 1"]),
["Representa una clave por nodo y guarda mínimo y cantidad total","Inicializa una representación vacía coherente","Inserta por orden y actualiza multiplicidad y cantidad total","Consulta el mínimo en O(1) y explica cómo mantenerlo al eliminar"],
`struct Nodo {
    int elemento, ocurrencias;
    Nodo *izq, *der;
};
struct RepMultiset {
    Nodo *raiz;
    int cantidad, minimo;
};
typedef RepMultiset *Multiset;

Multiset crear() {
    Multiset m = new RepMultiset;
    m->raiz = NULL;
    m->cantidad = 0;
    m->minimo = 0;
    return m;
}

void insertar(Multiset &m, int x, int n) {
    Nodo **enlace = &m->raiz;
    while (*enlace != NULL && (*enlace)->elemento != x) {
        if (x < (*enlace)->elemento) {
            enlace = &(*enlace)->izq;
        } else {
            enlace = &(*enlace)->der;
        }
    }
    if (*enlace == NULL) {
        *enlace = new Nodo;
        (*enlace)->elemento = x;
        (*enlace)->ocurrencias = 0;
        (*enlace)->izq = NULL;
        (*enlace)->der = NULL;
    }
    (*enlace)->ocurrencias += n;
    if (m->cantidad == 0 || x < m->minimo) {
        m->minimo = x;
    }
    m->cantidad += n;
}

int min(Multiset m) {
    return m->minimo;
}

// Al desaparecer la menor clave, actualizar minimo con el
// nodo más a la izquierda del ABB restante, o 0 si quedó vacío.`,tree(["5 × 2","3 × 3","8 × 1"],[1]),"Ejercicio Multiset · inciso a",[
["Insertar 2 ocurrencias de 3 en la figura","3 queda con 3 ocurrencias. Total 6 y mínimo 3."],["Insertar (x = 8, n = 2) en vacío","Raíz 8, total 2 y mínimo 8."],["Insertar una nueva clave menor","El mínimo pasa a ser la nueva clave."]]);

coding(0,"Vaciar un Multiset desde su interfaz","Usá las operaciones del TAD para quitar todas las ocurrencias de una clave por iteración.","Implementá void vaciar(Multiset &m) usando solo cantidad, min, ocurrencias y eliminar(Multiset &m, int x, int n). La representación del TAD sigue disponible como multiset vacío. Eliminar libera los nodos que quedan sin ocurrencias.",tree(["5 × 2","3 × 1","8 × 1"]),
["Usa solo operaciones públicas","Protege la precondición de min","Quita todas las ocurrencias de la clave elegida","Deja m vacío usando eliminar y conserva su representación"],
`void vaciar(Multiset &m) {
    while (cantidad(m) > 0) {
        int x = min(m);
        eliminar(m, x, ocurrencias(m, x));
    }
}`,line([],"Multiset"),"Ejercicio Multiset · inciso b",[
["Figura inicial","Elimina 3, luego las dos ocurrencias de 5, y al final 8."],["m vacío","No llama a min."]]);

coding(6,"Eliminar duplicados consecutivos","Después de borrar el sucesor, comprobá si el nuevo sucesor también es igual.","Implementá void eliminarConsecutivos(Lista &lista) recursiva. Lista es nodo_lista* y tiene elem y sig. Conservá el primer nodo de cada bloque de valores iguales y liberá los duplicados consecutivos.",line([4,4,4,2,4,4],"Lista simple"),
["Protege el caso vacío","Compara solo con el sucesor existente","Reconecta sig y libera el duplicado","Tras borrar, vuelve a comprobar el mismo nodo"],
`void eliminarConsecutivos(Lista &lista) {
    if (lista != NULL) {
        if (lista->sig != NULL && lista->elem == lista->sig->elem) {
            nodo_lista *viejo = lista->sig;
            lista->sig = viejo->sig;
            delete viejo;
            eliminarConsecutivos(lista);
        } else {
            eliminarConsecutivos(lista->sig);
        }
    }
}`,line([4,2,4],"Lista simple"),"Solución del primer parcial · ejercicio 2",[
["4 → 4 → 4 → 2 → 4 → 4","4 → 2 → 4."],["1 → 2 → 1","Se conserva igual."],["Lista vacía","Queda vacía."]]);

coding(6,"Eliminar nodos entre iguales","Una eliminación puede crear una nueva coincidencia cerca del nodo anterior.","Implementá void eliminarEntreIguales(Lista &lista). Lista guarda inicio y fin. Cada nodo_lista tiene elem, ant y sig. Eliminá cada nodo interno cuyos vecinos tienen igual valor. Recorré de izquierda a derecha y reconsiderá el anterior tras cada borrado.",line([2,9,2,8,2],"Lista doble"),
["Protege ambos extremos antes de comparar vecinos","Actualiza anterior->sig y siguiente->ant","Libera el nodo eliminado y vuelve al anterior","Avanza en los demás casos y admite una lista vacía"],
`void eliminarEntreIguales(Lista &lista) {
    nodo_lista *actual = lista->inicio;
    while (actual != NULL) {
        if (actual->ant != NULL && actual->sig != NULL &&
            actual->ant->elem == actual->sig->elem) {
            nodo_lista *anterior = actual->ant;
            nodo_lista *siguiente = actual->sig;
            anterior->sig = siguiente;
            siguiente->ant = anterior;
            delete actual;
            actual = anterior;
        } else {
            actual = actual->sig;
        }
    }
}`,line([2,2],"Lista doble"),"Solución del primer parcial · ejercicio 3",[
["2 ↔ 9 ↔ 2 ↔ 8 ↔ 2","Queda 2 ↔ 2."],["Lista de uno o dos nodos","Queda igual."]]);


coding(6,"Insertar en ambos extremos","Una lista doble con inicio y fin puede insertar en ambos extremos en O(1).","Con Lista inicializada (inicio y fin inicialmente NULL), escribí insertarFrente(Lista &, int) e insertarFinal(Lista &, int). Cada nodo_lista contiene elem, ant y sig. Considerá lista vacía y no vacía.",line([8,10],"Lista doble"),
["Crea nodos y deja los enlaces externos en NULL","Actualiza ambos extremos si la lista estaba vacía","Reconecta los vecinos en ambos sentidos","Cada inserción usa tiempo constante"],
`void insertarFrente(Lista &l, int dato) {
    nodo_lista *nuevo = new nodo_lista;
    nuevo->elem = dato;
    nuevo->ant = NULL;
    nuevo->sig = l->inicio;
    if (l->inicio == NULL) {
        l->fin = nuevo;
    } else {
        l->inicio->ant = nuevo;
    }
    l->inicio = nuevo;
}

void insertarFinal(Lista &l, int dato) {
    nodo_lista *nuevo = new nodo_lista;
    nuevo->elem = dato;
    nuevo->sig = NULL;
    nuevo->ant = l->fin;
    if (l->fin == NULL) {
        l->inicio = nuevo;
    } else {
        l->fin->sig = nuevo;
    }
    l->fin = nuevo;
}`,line([3,8,10,12],"Lista doble"),"Práctico de listas dobles",[
["Insertar 3 al frente y 12 al final","3 ↔ 8 ↔ 10 ↔ 12."],["Insertar en vacío","inicio y fin apuntan al mismo nodo."]]);

coding(6,"Ordenar usando la interfaz de Lista","Seleccionar un mínimo en cada pasada permite ordenar sin acceder a los nodos.","Escribí void ordenarLista(Lista &lista) de menor a mayor usando inicializar, esVaciaLista, obtenerMinimo, eliminarElemento (quita una ocurrencia), insertarFinal y destruirLista. Podés crear una lista auxiliar. Conservá las repeticiones.",line([4,1,4,2],"Lista doble"),
["Usa solo operaciones del TAD y crea una auxiliar vacía","Busca mínimos únicamente en una lista no vacía","Transfiere una ocurrencia por vez y conserva duplicados","Libera el contenedor original vacío y actualiza lista"],
`void ordenarLista(Lista &lista) {
    Lista ordenada;
    inicializar(ordenada);
    while (!esVaciaLista(lista)) {
        int x = obtenerMinimo(lista);
        eliminarElemento(lista, x);
        insertarFinal(ordenada, x);
    }
    destruirLista(lista);
    lista = ordenada;
}`,line([1,2,4,4],"Lista doble"),"Práctico de listas dobles · parte b",[
["4, 1, 4, 2","1, 2, 4, 4."],["Lista vacía","Queda vacía."]]);

exercise(7,2,"Moda y complejidad","Cada iteración del recorrido exterior puede lanzar un recorrido entero.","Para una lista de n caracteres, una función cuenta las apariciones de cada nodo recorriendo toda la lista en cada iteración. ¿Cuál es su orden de tiempo?",line(["a","b","b","a"],"Lista simple"),"Θ(n²)","Θ(n²). Con un arreglo indexado por unsigned char, el alfabeto fijo permite contar en Θ(n) y elegir en otra pasada el primer carácter empatado.",line(["a: 2","b: 2"],"Frecuencias"),["Θ(n)","Θ(n log n)","Θ(n²)"]);
exercise(7,2,"Colisión con encadenamiento","El hash elige un balde. Dentro de ese balde se comparan las claves.","Con h(x) = x % 5, ¿en qué balde caen las claves 2, 7 y 12?",line([2,7,12],"Claves"),[2],"Las tres caen en el balde 2. En hashing con encadenamiento se guardan en la lista de ese balde.",line([2,7,12],"Balde 2 · cadena"));
exercise(7,2,"Extraer el mínimo de un heap","Un min-heap entrega primero la menor prioridad.","Insertás prioridades 8, 2, 5 y 1 en un min-heap. ¿Cuáles son las primeras dos prioridades que salen al extraer el mínimo dos veces?",general([[1,200,28],[2,110,84,0],[5,290,84,0],[8,60,142,1]],"Min-heap"),[1,2],"Salen 1 y 2. Cada extracción reemplaza la raíz por el último elemento y lo baja hasta recuperar el orden de heap.",general([[5,200,28],[8,110,84,0]],"Min-heap restante"));
exercise(7,2,"Dos accesos a los mismos datos","Una multiestructura permite acceder al mismo registro desde índices distintos.","Una tabla hash por ID y una lista ordenada por puntaje apuntan a los mismos registros. ¿Qué se actualiza al cambiar el puntaje de un registro sin cambiar su ID?",line(["Hash por ID","Registro","Lista por puntaje"],"Índices"),"Registro y posición en la lista","Actualizá el puntaje del registro compartido y su posición en la lista. La clave y el balde del índice hash siguen siendo los mismos.",line(["Hash por ID","Registro actualizado","Lista reordenada"],"Índices"),["Solo el hash","Solo el puntaje del registro","Registro y posición en la lista"]);
