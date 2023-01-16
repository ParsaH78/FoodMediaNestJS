import * as api from '../api/index.js';

export const login = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_START" });

    const { data } = await api.login(formData);

    dispatch({ type: "LOGIN_SUCCESS", payload: data });

    localStorage.setItem('token', JSON.stringify(data));
    window.location.reload();

  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};

export const register = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_START" });

    const { data } = await api.register(formData);

    dispatch({ type: "REGISTER_SUCCESS", payload: data });
    navigate("/login");

  } catch (error) {
    dispatch({ type: "REGISTER_FAILURE", payload: error.data });
  }
};

export const googleLogin = () => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_START" });

    // await api.googleLogin();
    window.open("http://localhost:8800/auth/google", "_self");
    const data = await api.loginSuccess();

    dispatch({type: "LOGIN_SUCCESS", payload: data.user});

    localStorage.setItem('token', JSON.stringify(data.user));
    window.location.reload();
  } catch (error) {
    // dispatch({ type: "LOGIN_FAILURE", payload: error });
    console.log(error)
  }
}

export const logout = () => async (dispatch) => {
  localStorage.clear();
  dispatch({ type: "LOGOUT" });
  window.location.reload();
}

export const reset = () => (dispatch) => {
  dispatch({type: "RESET"});
}