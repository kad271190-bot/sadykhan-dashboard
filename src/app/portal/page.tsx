'use client';

import { useState } from 'react';

const departments = [
  {
    id: 'control',
    name: 'Контроль и аудит',
    icon: '🛡️',
    color: 'red',
    head: 'АД (Вы)',
    access: 'Полный доступ',
    subs: [
      {
        name: 'Антифрод',
        agents: ['Аномалии лояльности → тикет СБ', 'Кассовые нарушения → алерт', 'ВТД-сверка → недостачи'],
        status: 'active',
        kpi: { label: 'Открытых тикетов', value: '3', color: 'red' },
      },
      {
        name: 'NPS и сервис',
        agents: ['NPS-отчёт → задача фармацевту', 'Рейтинг сотрудников авто', 'Тренд жалоб → рекомендации'],
        status: 'active',
        kpi: { label: 'NPS', value: '44', color: 'amber' },
      },
      {
        name: 'Репутация',
        agents: ['2ГИС / Google мониторинг', 'Негатив → задача ответственному', 'Авто-ответы (в разработке)'],
        status: 'active',
        kpi: { label: 'Рейтинг', value: '3.48', color: 'amber' },
        link: '/dashboard',
      },
    ],
  },
  {
    id: 'development',
    name:
