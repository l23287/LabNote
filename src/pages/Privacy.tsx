import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh px-6 pt-6 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mb-8"
        aria-label="Zurück"
      >
        <ChevronLeft size={20} />
      </button>

      <h1 className="font-display text-2xl font-extrabold mb-2">Datenschutz</h1>
      <p className="text-muted text-sm mb-8">
        Hinweis: Dies ist ein Platzhaltertext und ersetzt keine rechtliche Prüfung. Vor dem
        Einsatz mit echten Nutzer:innen muss dieser Text von einer datenschutzrechtlich
        qualifizierten Person geprüft und ergänzt werden (u. a. Verantwortlicher, Rechtsgrundlage,
        Speicherdauer, ggf. Auftragsverarbeitungsvertrag mit dem Hosting-Anbieter).
      </p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="font-display font-bold text-ink mb-2">Welche Daten werden gespeichert?</h2>
          <p>
            Name, E-Mail-Adresse, ein Passwort-Hash (kein Klartext-Passwort), optional Klasse und
            die E-Mail-Adresse einer Lehrkraft, sowie die von dir erstellten Experimentprotokolle
            inklusive Fotos.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-ink mb-2">Wo werden die Daten gespeichert?</h2>
          <p>
            Aktuell ausschließlich lokal auf deinem Gerät im Browser (kein externer Server). Die
            Daten verlassen dein Gerät nicht, außer du exportierst oder versendest sie selbst
            (z. B. als PDF per E-Mail).
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-ink mb-2">Deine Rechte</h2>
          <p>
            Du kannst deine Daten jederzeit in den Profileinstellungen als Datei exportieren oder
            dein Konto inklusive aller Protokolle vollständig löschen.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-ink mb-2">Minderjährige</h2>
          <p>
            Wenn du unter 16 Jahre alt bist, benötigst du die Einwilligung deiner
            Erziehungsberechtigten, bevor du diese App nutzt.
          </p>
        </section>
      </div>
    </div>
  );
}
