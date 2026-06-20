import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
	const navigate = useNavigate();
	const { register } = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [touched, setTouched] = useState({});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		tipoDocumento: '',
		documento: '',
		correo: '',
		contraseña: '',
		confirmarContraseña: '',
		nombres: '',
		apellidos: '',
		fechaNacimiento: '',
	});

	const validaciones = {
		documento: {
			longitud: form.documento.length >= 6 && form.documento.length <= 12,
		},
		correo: {
			tieneArroba: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo),
		},
		contraseña: {
			minCaracteres: form.contraseña.length >= 8,
			tieneMayuscula: /[A-Z]/.test(form.contraseña),
			tieneMinuscula: /[a-z]/.test(form.contraseña),
			tieneNumero: /[0-9]/.test(form.contraseña),
			tieneEspecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
				form.contraseña,
			),
		},
	};

	const igualContraseña = form.confirmarContraseña === form.contraseña;
	const documentoValido = Object.values(validaciones.documento).every(
		Boolean,
	);
	const correoValido = Object.values(validaciones.correo).every(Boolean);
	const contraseñaValida = Object.values(validaciones.contraseña).every(
		Boolean,
	);
	const formularioValido =
		documentoValido && correoValido && contraseñaValida;

	const handleChange = (e) => {
		let value = e.target.value;
		if (e.target.name === 'documento') value = value.replace(/\D/g, '');
		setForm({ ...form, [e.target.name]: value });
		setTouched({ ...touched, [e.target.name]: true });
		setError('');
	};

	const Regla = ({ ok, texto }) => (
		<span
			className={`block text-xs ${ok ? 'text-green-600' : 'text-red-500'}`}
		>
			{ok ? '✅' : '❌'} {texto}
		</span>
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setTouched({
			documento: true,
			correo: true,
			contraseña: true,
			confirmarContraseña: true,
			tipoDocumento: true,
			nombres: true,
			apellidos: true,
			fechaNacimiento: true,
		});

		if (!formularioValido) {
			setError(
				'Por favor corrige los errores en el formulario antes de continuar.',
			);
			return;
		}
		if (form.contraseña !== form.confirmarContraseña) {
			setError('Las contraseñas no coinciden');
			return;
		}

		setLoading(true);
		try {
			await register({
				document: form.documento,
				doc_type: form.tipoDocumento,
				names: form.nombres.trim(),
				last_names: form.apellidos.trim(),
				birth_date: form.fechaNacimiento,
				email: form.correo.toLowerCase().trim(),
				password: form.contraseña,
			});
			navigate('/');
		} catch (err) {
			const data = err.response?.data;
			if (err.response?.status === 400 && data) {
				setError(
					Object.values(data).flat().join('. ') ||
						'Error al registrar.',
				);
			} else if (err.response?.status === 409) {
				setError('El documento o correo ya existe.');
			} else {
				setError('Error al conectar con el servidor.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center py-4"
			style={{ backgroundColor: '#f5f0ff' }}
		>
			<div className="max-w-[800px] w-[95%] bg-white rounded-[15px] shadow-lg p-5">
				<h2 className="text-center font-bold text-xl mb-4 text-gray-900">
					Crea una cuenta en <br />
					PsychoWay
				</h2>

				{error && (
					<div className="flex items-center gap-2 bg-red-100 text-red-700 rounded-lg px-3 py-2 mb-3 text-sm">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="shrink-0"
						>
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
							<line x1="12" y1="9" x2="12" y2="13" />
							<line x1="12" y1="17" x2="12.01" y2="17" />
						</svg>
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Nombres */}
						<div>
							<label className="block text-gray-500 text-xs font-bold mb-1">
								Nombres
							</label>
							<input
								type="text"
								name="nombres"
								value={form.nombres}
								onChange={handleChange}
								required
								placeholder="Nombres"
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
							/>
						</div>
						{/* Apellidos */}
						<div>
							<label className="block text-gray-500 text-xs font-bold mb-1">
								Apellidos
							</label>
							<input
								type="text"
								name="apellidos"
								value={form.apellidos}
								onChange={handleChange}
								required
								placeholder="Apellidos"
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
							/>
						</div>

						{/* Tipo documento */}
						<div>
							<label className="block text-gray-500 text-xs font-bold mb-1">
								Tipo de documento
							</label>
							<select
								name="tipoDocumento"
								value={form.tipoDocumento}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
							>
								<option value="" disabled>
									Seleccione
								</option>
								<option value="TI">Tarjeta de identidad</option>
								<option value="CC">Cédula de ciudadanía</option>
								<option value="CE">
									Cédula de extranjería
								</option>
							</select>
						</div>
						{/* Documento */}
						<div>
							<label className="block text-gray-500 text-xs font-bold mb-1">
								Documento
							</label>
							<div className="flex">
								<span className="flex items-center px-3 bg-white border border-r-0 rounded-l-md">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#4B0082"
										strokeWidth="2"
									>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</span>
								<input
									type="text"
									name="documento"
									value={form.documento}
									onChange={handleChange}
									placeholder="Número de documento"
									maxLength={12}
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
								/>
							</div>
							{touched.documento && (
								<Regla
									ok={validaciones.documento.longitud}
									texto="Ingrese un número de documento válido"
								/>
							)}
						</div>

						{/* Fecha nacimiento */}
						<div>
							<label className="block text-gray-500 text-xs font-bold mb-1">
								Fecha de nacimiento
							</label>
							<input
								type="date"
								name="fechaNacimiento"
								value={form.fechaNacimiento}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
							/>
						</div>
						{/* Correo */}
						<div>
							<label className="block text-gray-500 text-xs font-bold mb-1">
								Correo electrónico
							</label>
							<div className="flex">
								<span className="flex items-center px-3 bg-white border border-r-0 rounded-l-md">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#4B0082"
										strokeWidth="2"
									>
										<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
										<polyline points="22,6 12,13 2,6" />
									</svg>
								</span>
								<input
									type="email"
									name="correo"
									value={form.correo}
									onChange={handleChange}
									required
									placeholder="ejemplo@correo.com"
									className="w-full px-3 py-2 border border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
								/>
							</div>
							{touched.correo && (
								<Regla
									ok={validaciones.correo.tieneArroba}
									texto="Debe ser un correo válido"
								/>
							)}
						</div>

						{/* Contraseña */}
						<div>
							<label className="block text-gray-500 text-xs font-bold mb-1">
								Contraseña
							</label>
							<div className="flex">
								<span className="flex items-center px-3 bg-white border border-r-0 rounded-l-md">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#4B0082"
										strokeWidth="2"
									>
										<rect
											x="3"
											y="11"
											width="18"
											height="11"
											rx="2"
											ry="2"
										/>
										<path d="M7 11V7a5 5 0 0 1 10 0v4" />
									</svg>
								</span>
								<input
									type={showPassword ? 'text' : 'password'}
									name="contraseña"
									value={form.contraseña}
									onChange={handleChange}
									required
									placeholder="*********"
									className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									onMouseEnter={(e) =>
										!loading &&
										(e.target.style.backgroundColor =
											'#e8cdff')
									}
									onMouseLeave={(e) =>
										!loading &&
										(e.target.style.backgroundColor =
											'white')
									}
									className="flex items-center px-3 bg-white border border-l-0 rounded-r-md cursor-pointer"
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#4B0082"
										strokeWidth="2"
									>
										{showPassword ? (
											<>
												<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
												<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
												<line
													x1="1"
													y1="1"
													x2="23"
													y2="23"
												/>
											</>
										) : (
											<>
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
												<circle cx="12" cy="12" r="3" />
											</>
										)}
									</svg>
								</button>
							</div>
							<div className="mt-1">
								<p className="text-xs text-gray-500 mb-1">
									La contraseña debe contener:
								</p>
								<Regla
									ok={validaciones.contraseña.minCaracteres}
									texto="Mínimo 8 caracteres"
								/>
								<Regla
									ok={validaciones.contraseña.tieneMayuscula}
									texto="Al menos 1 letra mayúscula"
								/>
								<Regla
									ok={validaciones.contraseña.tieneMinuscula}
									texto="Al menos 1 letra minúscula"
								/>
								<Regla
									ok={validaciones.contraseña.tieneNumero}
									texto="Al menos 1 número"
								/>
								<Regla
									ok={validaciones.contraseña.tieneEspecial}
									texto="Al menos 1 carácter especial (!@#$%...)"
								/>
							</div>
						</div>
						{/* Confirmar contraseña */}
						<div>
							<label className="block text-gray-500 text-xs font-bold mb-1">
								Confirmar contraseña
							</label>
							<div className="flex">
								<span className="flex items-center px-3 bg-white border border-r-0 rounded-l-md">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#4B0082"
										strokeWidth="2"
									>
										<rect
											x="3"
											y="11"
											width="18"
											height="11"
											rx="2"
											ry="2"
										/>
										<path d="M7 11V7a5 5 0 0 1 10 0v4" />
									</svg>
								</span>
								<input
									type={
										showConfirmPassword
											? 'text'
											: 'password'
									}
									name="confirmarContraseña"
									value={form.confirmarContraseña}
									onChange={handleChange}
									required
									placeholder="*********"
									className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword,
										)
									}
									onMouseEnter={(e) =>
										!loading &&
										(e.target.style.backgroundColor =
											'#e8cdff')
									}
									onMouseLeave={(e) =>
										!loading &&
										(e.target.style.backgroundColor =
											'white')
									}
									className="flex items-center px-3 bg-white border border-l-0 rounded-r-md cursor-pointer"
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#4B0082"
										strokeWidth="2"
									>
										{showConfirmPassword ? (
											<>
												<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
												<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
												<line
													x1="1"
													y1="1"
													x2="23"
													y2="23"
												/>
											</>
										) : (
											<>
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
												<circle cx="12" cy="12" r="3" />
											</>
										)}
									</svg>
								</button>
							</div>
							{touched.confirmarContraseña && (
								<Regla
									ok={igualContraseña}
									texto="Las contraseñas coinciden"
								/>
							)}
						</div>
					</div>

					<div className="mt-4">
						<button
							type="submit"
							disabled={loading}
							className="w-full py-2 rounded-lg font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
							style={{
								backgroundColor: loading
									? '#8a5cb0'
									: '#4B0082',
								color: 'white',
							}}
						>
							{loading ? 'Registrando...' : 'Registrarse'}
						</button>
					</div>

					<div className="text-center mt-3">
						<span className="text-gray-500 text-sm">
							¿Ya tienes una cuenta?{' '}
						</span>
						<Link
							to="/"
							className="font-bold text-sm no-underline"
							style={{ color: '#4B0082' }}
						>
							Inicia Sesión
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
