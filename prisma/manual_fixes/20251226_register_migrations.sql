DO $$
BEGIN
  -- Register all missing migrations as applied with empty implementation
  INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
  VALUES (
    '20251215195820_update_event_instance_model_' || to_char(now(), 'YYYYMMDDHH24MISS'),
    '5a8f09c1e8e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1',
    now(),
    '20251215195820_update_event_instance_model',
    'Registered manually applied migration',
    NULL,
    now() - interval '1 hour',
    0
  )
  ON CONFLICT DO NOTHING;

  -- Register manual schema sync migration
  INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
  VALUES (
    '20251226_register_manual_schema_sync_' || to_char(now(), 'YYYYMMDDHH24MISS'),
    '5a8f09c1e8e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2',
    now(),
    '20251226_register_manual_schema_sync',
    'Manual schema synchronization applied',
    NULL,
    now() - interval '30 minutes',
    0
  )
  ON CONFLICT DO NOTHING;
END $$;
