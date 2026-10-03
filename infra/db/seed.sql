INSERT INTO profiles (id, display_name, bio)
VALUES ('demo-user', 'Piloto Rastro', 'Perfil de demonstração')
ON CONFLICT (id) DO NOTHING;

INSERT INTO trail_versions (
  id, author_id, name, description, region, visibility, geometry_json,
  estimated_duration_min, estimated_duration_max, general_difficulty,
  vehicle_ratings, status
)
VALUES (
  'trail-serra-azul', 'demo-user', 'Serra Azul',
  'Roteiro de 4x4 com mirantes e trechos de terra compactada.', 'MG', 'public',
  '[{"latitude":-19.921,"longitude":-43.945},{"latitude":-19.934,"longitude":-43.932}]'::jsonb,
  150, 240, 'moderate',
  '[{"vehicleType":"4x4","rating":4,"notes":"Reduzida recomendada em chuva."}]'::jsonb,
  'open'
)
ON CONFLICT (id) DO NOTHING;
