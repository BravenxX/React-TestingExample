import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import App, { Todo, TodoForm, useTodos } from "./App";

configure({ adapter: new Adapter() });

describe("App", () => {
  /**
   * Test unitarios
   * a Todo
   */

  describe("Todo", () => {
    it("Se ejecuta completeTodo cuando se presiona Complete", () => {
      /**
       * Creamos un mock con jest
       */

      const completeTodo = jest.fn();
      const removeTodo = jest.fn();

      const index = 5;
      const todo = {
        isCompleted: true,
        text: "test todo"
      };

      const wrapper = shallow(
        <Todo
          completeTodo={completeTodo}
          removeTodo={removeTodo}
          index={index}
          todo={todo}
        />
      );

      /**
       * Wrapper
       * devuelve elementos del dom
       */

      wrapper
        .find("button")
        .at(0)
        .simulate("click");

      /**
       * expect
       *
       * lanza una excepción en el caso de
       * que una condición no se cumpla en los tests
       */

      /**
       * completeTodo.mock.calls
       *
       * será de esta forma: [[3],[3,3]]
       * Sí fue llamado dos veces
       * y si en la segunda vez fue llamado
       * con dos argumentos
       */

      expect(completeTodo.mock.calls).toEqual([[5]]);

      /**
       * Nos aseguramos de que no el otro boton (removeTodo)
       * no sea llamado
       */

      expect(removeTodo.mock.calls).toEqual([]);
    });

    /**
     * Hacemos el mismo test con el segundo boton de removeTodo
     */

    it("Se ejecuta removeTodo cuando se presiona X", () => {
      /**
       * Creamos un mock con jest
       */

      const completeTodo = jest.fn();
      const removeTodo = jest.fn();

      const index = 5;
      const todo = {
        isCompleted: true,
        text: "test todo"
      };

      const wrapper = shallow(
        <Todo
          completeTodo={completeTodo}
          removeTodo={removeTodo}
          index={index}
          todo={todo}
        />
      );

      /**
       * Wrapper
       * devuelve elementos del dom
       */

      wrapper
        .find("button")
        .at(1)
        .simulate("click");

      /**
       * expect
       *
       * lanza una excepción en el caso de
       * que una condición no se cumpla en los tests
       */

      /**
       * completeTodo.mock.calls
       *
       * será de esta forma: [[3],[3,3]]
       * Sí fue llamado dos veces
       * y si en la segunda vez fue llamado
       * con dos argumentos
       */

      expect(removeTodo.mock.calls).toEqual([[5]]);
      expect(completeTodo.mock.calls).toEqual([]);
    });
  });

  /**
   * Test de integración
   * de TodoForm
   */

  describe("TodoForm", () => {
    it("Llamar a Todo cuando el formulario tenga un valor", () => {
      const addTodo = jest.fn();
      const prevent = jest.fn();
      const wrapper = shallow(<TodoForm addTodo={addTodo} />);

      /**
       * Simulate('change')
       *
       * Simulará un onChange en el input
       *
       * El evento tiene la propiedad de target
       * y este target tiene la propiedad de value
       * la cual  le asignaremos aquí
       */

      wrapper
        .find("input")
        .simulate("change", { target: { value: "mi nuevo todo test" } });

      /**
       * simulate('submit')
       *
       * Simulará el evento onSubmit
       */

      wrapper.find("form").simulate("submit", { preventDefault: prevent });

      expect(addTodo.mock.calls).toEqual([["mi nuevo todo test"]]);

      expect(prevent.mock.calls).toEqual([[]]);
    });
  });

  /**
   * Test de HOOKs
   */

  describe("custom hook: useTodos", () => {
    it("addTodo", () => {
      const Test = props => {
        const hook = props.hook();
        return <div {...hook}></div>;
      };

      const wrapper = shallow(<Test hook={useTodos} />);

      let props = wrapper.find("div").props();
      props.addTodo("texto de prueba");
      props = wrapper.find("div").props();

      expect(props.todos[0]).toEqual({ text: "texto de prueba" });
    });

    it("completeTodo", () => {
      const Test = props => {
        const hook = props.hook();
        return <div {...hook}></div>;
      };

      const wrapper = shallow(<Test hook={useTodos} />);

      let props = wrapper.find("div").props();
      props.completeTodo(0);
      props = wrapper.find("div").props();

      expect(props.todos[0]).toEqual({ text: "Todo 1", isCompleted: true });
    });

    it("removeTodo", () => {
      const Test = props => {
        const hook = props.hook();
        return <div {...hook}></div>;
      };

      const wrapper = shallow(<Test hook={useTodos} />);

      let props = wrapper.find("div").props();
      props.removeTodo(0);
      props = wrapper.find("div").props();

      expect(props.todos).toEqual([
        {
          text: "Todo 2",
          isCompleted: false
        },
        {
          text: "Todo 3",
          isCompleted: false
        }
      ]);
    });

    /**
     * Prueba de integración completa
     */

    it("App", () => {
      const wrapper = mount(<App />);

      const prevent = jest.fn();

      wrapper
        .find("input")
        .simulate("change", { target: { value: "mi todo" } });

      wrapper.find("form").simulate("submit", { preventDefault: prevent });

      /**
       * .todo
       * Buscaremos todos los components
       * con un className === 'todo'
       */

      /**
       * .text() hará que
       *
       * todo lo selecciónado anteriormente: wrapper.find(".todo").at(0)
       * se transforme en texto plano
       */

      /**
       * .include()
       *
       * Devuelve true o false si el string
       * pasado es encuentra en el texto
       */

      const respuesta = wrapper
        .find(".todo")
        .at(0)
        .text()
        .includes("mi todo");

      expect(respuesta).toEqual(true);
      expect(prevent.mock.calls).toEqual([[]]);
    });
  });
});
