export async function saveQuizScore(score, user) {
  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, user }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json?.error ?? json?.message ?? 'Failed to save score.' };
    }
    return json;
  } catch (error) {
    return { success: false, error: error?.message ?? 'Failed to save score.' };
  }
}

export async function fetchLeaderboard() {
  try {
    const res = await fetch('/api/games/leaderboard', { cache: 'no-store' });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json?.error ?? json?.message ?? 'Failed to fetch leaderboard.' };
    }
    return json;
  } catch (error) {
    return { success: false, error: error?.message ?? 'Failed to fetch leaderboard.' };
  }
}
