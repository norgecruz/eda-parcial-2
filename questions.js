const topics = ["Multiset", "Pilas y colas", "Recorridos", "Eliminación", "Parciales anteriores"];
const base = [40,20,60,10,30,50,70];
const tree = (values, highlights = []) => ({values, highlights});
const line = (values, kind = "Cola") => ({line:values, kind});
const questions = [];
function exercise(topic, level, title, lesson, prompt, visual, key, ideal, after, options) {
  questions.push({topic, level, title, lesson, prompt, visual, key, ideal, after, options});
}
exercise(0,1,"Un nodo por clave","En un Multiset con ABB, cada clave distinta ocupa un nodo. El nodo guarda sus ocurrencias.","Insertás 5, 3, 8, 5, 3 y 5 en un Multiset vacío. ¿Cuántos nodos hay, cuántos elementos hay en total y cuántas ocurrencias tiene 5? Escribí los tres números en ese orden.",tree([5,3,8]),[3,6,3],"Hay 3 nodos y 6 elementos en total. El 5 tiene 3 ocurrencias.",tree(["5 × 3","3 × 2","8 × 1"],[0]));
exercise(0,2,"Claves iguales, cantidades distintas","mismosElementos compara las multiplicidades de cada clave, aunque los ABB tengan formas distintas.","A = {2, 2, 4, 7} y B = {2, 4, 4, 7}. ¿Qué retorna mismosElementos(A, B)?",tree(["4 × 1","2 × 2","7 × 1"]),"false","false. El total coincide, pero 2 aparece dos veces en A y una en B.",tree(["4 × 2","2 × 1","7 × 1"],[1]),["true","false"]);
exercise(1,1,"La cima de la pila","LIFO significa que el último elemento en entrar es el primero en salir.","Apilás 5, 10 y 15. Desapilás una vez, apilás 20 y volvés a desapilar. ¿Qué valor sale en el segundo desapilar?",line([15,10,5],"Pila"),[20],"Sale 20. Primero salió 15, así que 20 queda en la cima al apilarlo.",line([10,5],"Pila"));
exercise(1,1,"El frente de la cola","FIFO significa que el primero en entrar es el primero en salir.","Encolás 3, 8, 10, desencolás una vez y encolás 12. ¿Cómo queda la cola de frente a final?",line([3,8,10]),[8,10,12],"Queda 8 → 10 → 12. Sale 3 por el frente y entra 12 por el final.",line([8,10,12]));
exercise(2,1,"Preorder","Visitá la raíz antes de entrar a sus hijos.","Escribí el recorrido preorder del árbol.",tree(base),[40,20,10,30,60,50,70],"Raíz → izquierda → derecha. Resultado: 40, 20, 10, 30, 60, 50, 70.",line([40,20,10,30,60,50,70],"Orden de visita"));
exercise(2,1,"Inorder","Visitá el subárbol izquierdo, la raíz y el subárbol derecho.","Escribí el recorrido inorder del árbol.",tree(base),[10,20,30,40,50,60,70],"Izquierda → raíz → derecha. En este ABB salen las claves en orden creciente.",line([10,20,30,40,50,60,70],"Orden de visita"));
exercise(2,2,"Postorder","Procesá ambos hijos antes de visitar el nodo actual.","Escribí el recorrido postorder del árbol.",tree(base),[10,30,20,50,70,60,40],"Izquierda → derecha → raíz. Resultado: 10, 30, 20, 50, 70, 60, 40.",line([10,30,20,50,70,60,40],"Orden de visita"));
exercise(3,1,"Eliminar una ocurrencia","Si quedan ocurrencias de la clave, el nodo sigue en el árbol.","El Multiset tiene 4 elementos. Eliminás una ocurrencia de 20. ¿Cuántas ocurrencias tiene 20 y cuál es la cantidad total después? Escribí ambos números en ese orden.",tree(["40 × 1","20 × 2","60 × 1"],[1]),[1,3],"20 conserva una ocurrencia. La cantidad total baja de 4 a 3.",tree(["40 × 1","20 × 1","60 × 1"],[1]));
exercise(3,1,"Eliminar una hoja","El enlace que apuntaba a una hoja eliminada debe quedar vacío.","Eliminás el nodo 30. ¿Qué valor queda en el puntero derecho de 20?",tree(base,[4]),"NULL","20->der queda en NULL. Luego se libera el nodo 30, conservando una referencia temporal si hace falta.",tree([40,20,60,10,null,50,70]),["NULL","10","20","40"]);
exercise(3,2,"Reconectar al hijo único","El enlace del padre puede actualizarse por referencia con Nodo *&.","Eliminás 20. ¿A qué clave debe apuntar ahora 40->izq?",tree([40,20,60,null,30],[1]),[30],"El nuevo hijo izquierdo de 40 es 30. Guardá el nodo 20, reasigná el enlace al hijo 30 y liberá 20.",tree([40,30,60],[1]));
exercise(3,2,"Encontrar el sucesor","Para un nodo con subárbol derecho, su sucesor es el mínimo de ese subárbol.","¿Cuál es el sucesor inorder de 40?",tree(base,[0]),[50],"50. Desde 40 bajás a 60 por derecha y después a 50 por izquierda.",tree(base,[5]));
exercise(3,3,"Dos hijos y multiplicidad","Al reemplazar por el sucesor, mové su clave y todas sus ocurrencias juntas.","Eliminás la única ocurrencia de 40 usando el sucesor. ¿Qué clave queda en la raíz, cuántas ocurrencias tiene y cuánto disminuye la cantidad total? Respondé con tres números.",tree(["40 × 1","20 × 1","60 × 1","10 × 1","30 × 1","50 × 3","70 × 1"]),[50,3,1],"La raíz queda con clave 50 y 3 ocurrencias. Se desenlaza por completo el antiguo nodo 50, reconectando su hijo derecho si existe. El total baja exactamente en 1.",tree(["50 × 3","20 × 1","60 × 1","10 × 1","30 × 1",null,"70 × 1"],[0]));
exercise(0,3,"Implementar mismosElementos","Si los totales son iguales y cada clave de A tiene la misma multiplicidad en B, B tampoco puede tener claves extra.","Implementá bool mismosElementos(Multiset a, Multiset b). Usá los campos raiz y cantidad, y la operación ocurrencias(b, x). Podés definir una auxiliar. Suponé que cada clave se guarda en un solo nodo con ocurrencias > 0.",tree(["4 × 1","2 × 2","7 × 1"]),["Compara la cantidad total de ocurrencias de ambos multiset","Visita todos los nodos de A con un caso base correcto","Compara cada multiplicidad con ocurrencias(b, clave)","Propaga cualquier diferencia y acepta árboles con distinta forma"],`bool coinciden(Nodo *n, Multiset b) {
    if (n == NULL) {
        return true;
    }
    return n->ocurrencias == ocurrencias(b, n->elemento)
        && coinciden(n->izq, b)
        && coinciden(n->der, b);
}

bool mismosElementos(Multiset a, Multiset b) {
    return a->cantidad == b->cantidad && coinciden(a->raiz, b);
}`,tree(["2 × 2",null,"7 × 1",null,null,"4 × 1"],[0]));
exercise(4,2,"¿LIFO y FIFO dan lo mismo?","En el ejercicio de la foto, primero y ultimo quitan y devuelven un elemento de la lista.","Para una lista con orden de inserción 3, 8, 3, ¿qué retorna esLifoFifo?",line([3,8,3],"Lista doble"),"true","true. Desde ambos extremos, las secuencias completas son 3, 8, 3.",line([3,8,3],"Orden de salida"),["true","false"]);
exercise(4,3,"Implementar esLifoFifo","Si usás dos copias, podés extraer desde extremos opuestos y conservar la lista original.","Escribí bool esLifoFifo(Lista l) de forma iterativa, usando solo copia, esVacia, primero, ultimo y destruir del TAD. La lista vacía debe dar true. La lista original debe conservarse.",line([3,8,3],"Lista doble"),["Usa dos copias independientes y conserva la lista original","Usa esVacia antes de extraer y acepta una lista vacía","Compara primero de una copia con ultimo de la otra hasta diferencia o fin","Destruye ambas copias en todos los casos"],`bool esLifoFifo(Lista l) {
    Lista a = copia(l);
    Lista b = copia(l);
    bool iguales = true;
    while (!esVacia(a) && iguales) {
        if (primero(a) != ultimo(b)) {
            iguales = false;
        }
    }
    destruir(a);
    destruir(b);
    return iguales;
}`,line([3,8,3],"Comparación desde ambos extremos"));
exercise(4,2,"TAD Lista en tiempo constante","La pizarra muestra inicio, fin y enlaces sig y ant.","Al ejecutar primero sobre una lista de un solo nodo, ¿cómo quedan inicio y fin?",line([7],"Lista doble"),"Ambos en NULL","Ambos quedan en NULL. Guardás el valor del nodo antes de liberarlo. Con más de un nodo, actualizás inicio y dejás inicio->ant en NULL.",line([],"Lista doble"),["Solo inicio en NULL","Solo fin en NULL","Ambos en NULL"]);
exercise(4,3,"Implementar TAD Lista","Con inicio y fin podés insertar al final y quitar desde cualquiera de los extremos en O(1).","Definí la representación del TAD Lista e implementá crear, insertar al final y primero en O(1). Para primero se supone que la lista tiene al menos un elemento.",line([3,8,10],"Lista doble"),["Define enlaces sig y ant y punteros inicio y fin","crear inicializa ambos extremos en NULL","insertar actualiza los enlaces y contempla la lista vacía","primero libera el nodo, retorna su valor y corrige los extremos"],`struct NodoLista {
    int valor;
    NodoLista *sig, *ant;
};
struct RepLista {
    NodoLista *inicio, *fin;
};
typedef RepLista *Lista;

Lista crear() {
    Lista l = new RepLista;
    l->inicio = NULL;
    l->fin = NULL;
    return l;
}

void insertar(int x, Lista &l) {
    NodoLista *nuevo = new NodoLista;
    nuevo->valor = x;
    nuevo->sig = NULL;
    nuevo->ant = l->fin;
    if (l->fin == NULL) {
        l->inicio = nuevo;
    } else {
        l->fin->sig = nuevo;
    }
    l->fin = nuevo;
}

int primero(Lista &l) {
    NodoLista *viejo = l->inicio;
    int valor = viejo->valor;
    l->inicio = viejo->sig;
    if (l->inicio == NULL) {
        l->fin = NULL;
    } else {
        l->inicio->ant = NULL;
    }
    delete viejo;
    return valor;
}`,line([8,10],"Lista doble tras primero"));
const stock = tree(["40 (0)","20 (0)","60 (4)","10 (3)","30 (0)","50 (0)","70 (1)"]);
exercise(4,3,"stockear con poda","Las claves están ordenadas por ID. Cada etiqueta muestra ID (cantidad).","Implementá void stockear(ABB &t, unsigned int cant, int id_min, int id_max) recursivamente. Sumá cant en el intervalo inclusivo, podá los subárboles descartables y evitá auxiliares.",stock,["Protege el caso t == NULL","Suma cant a las claves dentro del intervalo inclusivo","Solo explora izquierda si la clave es mayor que el límite inferior","Solo explora derecha si la clave es menor que el límite superior"],`void stockear(ABB &t, unsigned int cant, int id_min, int id_max) {
    if (t != NULL) {
        int id = t->id_producto;
        if (id >= id_min && id <= id_max) {
            t->cantidad += cant;
        }
        if (id > id_min) {
            stockear(t->izq, cant, id_min, id_max);
        }
        if (id < id_max) {
            stockear(t->der, cant, id_min, id_max);
        }
    }
}`,tree(["40 (2)","20 (0)","60 (4)","10 (3)","30 (2)","50 (2)","70 (1)"],[0,4,5]));
exercise(4,3,"sinStock en orden decreciente","En el ABB de stock, un producto con cantidad cero conserva su nodo.","Implementá void sinStock(ABB t) para imprimir, recursivamente y sin auxiliares, los ID con cantidad 0 de mayor a menor.",stock,["Protege el caso t == NULL","Recorre el subárbol derecho primero","Imprime solo el ID si cantidad es cero","Recorre el subárbol izquierdo después de procesar la raíz"],`void sinStock(ABB t) {
    if (t != NULL) {
        sinStock(t->der);
        if (t->cantidad == 0) {
            printf("%d ", t->id_producto);
        }
        sinStock(t->izq);
    }
}`,line([50,40,30,20],"Orden de salida"));
exercise(4,3,"Peor caso con poda","Pensá en cuántos nodos se visitan en función de n, el número de nodos del ABB.","¿Cuál es la complejidad en el peor caso de stockear y sinStock?",stock,"Ambas Θ(n)","Ambas Θ(n). En stockear un intervalo que cubre todas las claves obliga a visitar los n nodos. sinStock debe revisar la cantidad de todos los nodos porque el ABB está ordenado por ID.",tree(stock.values,[0,1,2,3,4,5,6]),["Ambas Θ(n)","Ambas Θ(log n)","stockear Θ(log n), sinStock Θ(n)"]);
exercise(3,3,"Implementar eliminación de una ocurrencia","Con Nodo *& podés actualizar tanto la raíz como un enlace de un padre. La cantidad total baja una sola vez al borrar con éxito.","Implementá void eliminarUno(Multiset m, int x). Si x está, quitá una ocurrencia. Para un nodo con dos hijos usá el sucesor inorder. Podés definir una auxiliar.",tree(["40 × 1","20 × 1","60 × 1","10 × 1","30 × 1","50 × 3","70 × 1"]),["Busca x y deja todo igual si la clave no existe","Decrementa la multiplicidad si era mayor que uno y ajusta el total una sola vez","Actualiza el enlace y libera el nodo en los casos de hoja y de hijo único","Mueve clave y multiplicidad del sucesor y lo desenlaza conservando su hijo derecho"],`bool quitar(Nodo *&n, int x) {
    bool eliminado = false;
    if (n != NULL) {
        if (x < n->elemento) {
            eliminado = quitar(n->izq, x);
        } else if (x > n->elemento) {
            eliminado = quitar(n->der, x);
        } else {
            eliminado = true;
            if (n->ocurrencias > 1) {
                n->ocurrencias--;
            } else if (n->izq == NULL || n->der == NULL) {
                Nodo *viejo = n;
                n = n->izq != NULL ? n->izq : n->der;
                delete viejo;
            } else {
                Nodo **enlace = &n->der;
                while ((*enlace)->izq != NULL) {
                    enlace = &(*enlace)->izq;
                }
                Nodo *sucesor = *enlace;
                n->elemento = sucesor->elemento;
                n->ocurrencias = sucesor->ocurrencias;
                *enlace = sucesor->der;
                delete sucesor;
            }
        }
    }
    return eliminado;
}

void eliminarUno(Multiset m, int x) {
    if (quitar(m->raiz, x)) {
        m->cantidad--;
    }
}`,tree(["50 × 3","20 × 1","60 × 1","10 × 1","30 × 1",null,"70 × 1"],[0]));
