import { CircleCheckBig } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Register.module.scss";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpa erros anteriores
    setErrors({});
    setGeneralError("");

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "As senhas não coincidem",
      }));
      return;
    }

    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "A senha deve ter pelo menos 8 caracteres",
      }));
      return;
    }

    try {
      await register(email, password, name);
    } catch (error) {
      // Os erros já são tratados no contexto de autenticação
      // Este bloco é apenas para capturar qualquer erro não tratado
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach((err) => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      } else {
        setGeneralError(
          "Ocorreu um erro ao registrar. Tente novamente mais tarde."
        );
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.logoContainer}>
          <CircleCheckBig size={40} className={styles.logoIcon} />
          <h1 className={styles.logoText}>TaskCollab</h1>
        </div>

        <h2 className={styles.title}>Crie sua conta</h2>
        <p className={styles.subtitle}>
          Crie uma conta para acessar e gerenciar suas tarefas
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} ${
                errors.username ? styles.inputError : ""
              }`}
              placeholder="Seu nome"
              required
            />
            {errors.username && (
              <div className={styles.fieldError}>
                <AlertCircle size={14} />
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              placeholder="seu@email.com"
              required
            />
            {errors.email && (
              <div className={styles.fieldError}>
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              placeholder="Sua senha"
              required
            />
            {errors.password && (
              <div className={styles.fieldError}>
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${styles.input} ${
                errors.confirmPassword ? styles.inputError : ""
              }`}
              placeholder="Confirme sua senha"
              required
            />
            {errors.confirmPassword && (
              <div className={styles.fieldError}>
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {generalError && (
            <p className={styles.errorMessage}>{generalError}</p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <p className={styles.loginLink}>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
