INSERT INTO activities (id, title, description, date, time, location) VALUES
  ('act-01', 'Ankommen & Grillen', 'Gemütlicher Start in das Wochenende. Grill wird angeworfen, Getränke stehen kalt. Kommt einfach vorbei wenn ihr da seid!', '2026-06-19', '17:00 - 21:00', 'Garten'),
  ('act-02', 'Lagerfeuer & Drinks', 'Zum Tagesausklang sitzen wir am Feuer zusammen. Stockbrot und Marshmallows inklusive.', '2026-06-19', '21:00 - open end', 'Garten'),
  ('act-03', 'Gemeinsam Laufen', 'Lockere Runde durch den Park. Tempo passt sich an — niemand wird zurückgelassen.', '2026-06-20', '08:30 - 09:30', 'Treffpunkt: Haustür'),
  ('act-04', 'Brunch', 'Ausgiebig frühstücken mit allem was dazu gehört. Pancakes, Eier, Obst, Kaffee ohne Ende.', '2026-06-20', '10:30 - 12:30', 'Küche & Terrasse'),
  ('act-05', 'TopGolf', 'Ob Profi oder noch nie einen Schläger gehalten — hier geht es um Spaß, nicht um Handicap.', '2026-06-20', '14:00 - 17:00', 'TopGolf München'),
  ('act-06', 'Abendessen & Geburtstagsparty', 'Das große Dinner mit Geburtstagskuchen. Danach wird getanzt und gefeiert!', '2026-06-20', '19:00 - open end', 'Wohnzimmer & Garten'),
  ('act-07', 'Spaziergang am See', 'Gemütlicher Verdauungsspaziergang. Perfekt um den Kopf frei zu kriegen.', '2026-06-21', '10:00 - 11:30', 'Treffpunkt: Haustür'),
  ('act-08', 'Farewell-Brunch', 'Ein letztes gemeinsames Frühstück bevor alle wieder aufbrechen. Kaffee und Reste von gestern.', '2026-06-21', '12:00 - 14:00', 'Küche & Terrasse')
ON CONFLICT (id) DO NOTHING;
