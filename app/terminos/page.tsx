import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | FIRA Wellness Club",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Términos y Condiciones
        </h1>
        <p className="mt-2 text-sm text-warm-gray/60">
          Última actualización: Julio 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-warm-gray sm:text-base [&_strong]:text-foreground">

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar el sitio web de FIRA Wellness Club, aceptas cumplir con los presentes
              Términos y Condiciones. Si no estás de acuerdo con alguna parte, te pedimos que no utilices
              nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">2. Descripción del servicio</h2>
            <p>
              FIRA Wellness Club ofrece un sistema en línea para consultar horarios de clases (Pilates
              Reformer, Yoga y Soundbath), realizar reservaciones individuales o por paquete, adquirir
              membresías mensuales recurrentes y gestionar créditos de clase a través de un tablero
              personal. Todos los servicios se imparten de forma presencial en nuestras instalaciones.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">3. Membresías mensuales</h2>
            <p>
              Las membresías son planes de pago recurrente que ofrecen un número determinado de clases
              por mes o acceso ilimitado, según el plan elegido. Los precios actuales son:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>Esencial — 5 clases/mes — $1,600 MXN</li>
              <li>Balance — 8 clases/mes — $2,400 MXN</li>
              <li>Intenso — 12 clases/mes — $3,360 MXN</li>
              <li>Ilimitado — clases ilimitadas/mes — $4,500 MXN</li>
            </ul>
            <p className="mt-2">
              El cobro se realiza al inicio de cada periodo de facturación a través de Stripe. El
              número de clases se renueva cada mes. Las clases no utilizadas dentro del periodo no se
              acumulan al mes siguiente, a menos que se especifique lo contrario en la membresía
              contratada.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">4. Paquetes de clases</h2>
            <p>
              Los paquetes de clases son créditos prepagados que se compran como pago único. Cada
              paquete tiene un número fijo de clases que se descuentan al realizar una reservación.
              Los paquetes no tienen fecha de vencimiento, pero FIRA Wellness Club se reserva el
              derecho de establecer una vigencia máxima en el futuro notificando a las usuarias con
              anticipación.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">5. Clases individuales (drop-in)</h2>
            <p>
              Las clases sueltas tienen un costo de $350 MXN cada una y se adquieren mediante pago
              único a través de Stripe. Una vez realizada la reservación y confirmado el pago, la clase
              queda asegurada en el horario seleccionado.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">6. Proceso de reservación</h2>
            <p>
              Las reservaciones pueden realizarse a través del sitio web seleccionando la clase y el
              horario deseado. Para clases sueltas, el pago se realiza en el momento de la reservación
              a través de Stripe. Para usuarias registradas con paquete o membresía, las clases se
              descuentan de los créditos disponibles. La confirmación de la reservación está sujeta a
              la disponibilidad del horario seleccionado.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">7. Cancelación y reembolsos</h2>
            <p>
              Las clases se pueden cancelar con al menos 4 horas de anticipación para que el crédito
              o el espacio pueda ser reutilizado. Cancelaciones tardías o inasistencias sin aviso
              resultarán en la pérdida del crédito de clase o del pago realizado.
            </p>
            <p className="mt-2">
              Los reembolsos de paquetes y membresías se evalúan caso por caso. Para solicitar un
              reembolso, contáctanos en <strong>firawellness@gmail.com</strong>. Una vez realizado
              el pago de una clase individual (drop-in), no se realizan reembolsos, pero la usuaria
              puede cancelar dentro del plazo establecido para no perder el crédito.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">8. Pagos y procesador de pagos</h2>
            <p>
              Todos los pagos se procesan a través de Stripe México. FIRA Wellness Club no almacena
              ni tiene acceso a los datos completos de tarjetas bancarias. Stripe puede aplicar las
              comisiones correspondientes (3.6% + $3 MXN por transacción con tarjeta nacional). Los
              precios están expresados en pesos mexicanos (MXN) e incluyen los impuestos aplicables.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">9. Datos personales</h2>
            <p>
              Para brindar el servicio, recopilamos y almacenamos en Supabase (base de datos segura)
              los siguientes datos: nombre, correo electrónico, número de teléfono, historial de
              compras, créditos disponibles e historial de reservaciones. Estos datos se utilizan
              exclusivamente para operar el sistema de reservaciones, notificaciones y control de
              acceso a clases.
            </p>
            <p className="mt-2">
              No compartimos tus datos personales con terceros para fines publicitarios ni de venta.
              Los datos pueden ser compartidos con Stripe en la medida necesaria para procesar pagos.
              Al registrarte o realizar una compra, aceptas el tratamiento de tus datos conforme a
              estos términos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">10. Comunicaciones</h2>
            <p>
              Al realizar una reservación, recibirás correos electrónicos de confirmación enviados a
              través de Resend. El estudio también recibe notificaciones por teléfono a través del
              servicio ntfy. Estas comunicaciones son parte del funcionamiento normal del servicio y
              no constituyen spam ni comunicaciones comerciales no solicitadas.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">11. Cuenta de usuaria</h2>
            <p>
              Las usuarias registradas pueden acceder a un tablero personal donde consultan sus
              créditos disponibles, historial de reservaciones y compras. Es responsabilidad de la
              usuaria mantener la confidencialidad de su cuenta. FIRA Wellness Club no se hace
              responsable por accesos no autorizados derivados del uso compartido de credenciales.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">12. Responsabilidad</h2>
            <p>
              FIRA Wellness Club se esfuerza por mantener el sitio disponible y funcionando
              correctamente, pero no garantiza disponibilidad ininterrumpida. Las clases presenciales
              están sujetas a disponibilidad de instructores y condiciones del estudio. FIRA Wellness
              Club no se responsabiliza por lesiones o daños ocurridos durante la práctica de las
              clases. Al asistir, la usuaria reconoce los riesgos inherentes a la actividad física.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">13. Modificaciones</h2>
            <p>
              FIRA Wellness Club se reserva el derecho de modificar estos términos en cualquier
              momento. Los cambios serán publicados en esta página y, cuando sea relevante, se
              notificará a las usuarias registradas por correo electrónico.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">14. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos términos, puedes contactarnos en:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>Correo: <strong>firawellness@gmail.com</strong></li>
              <li>Dirección: Av. Horacio 632, Polanco, Ciudad de México</li>
              <li>Instagram: <strong>@firawellnessclub</strong></li>
              <li>TikTok: <strong>@firawellnessclub</strong></li>
            </ul>
          </section>

        </div>
      </article>
    </main>
  );
}
