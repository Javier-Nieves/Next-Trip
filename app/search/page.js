'use client';

import { navigate } from '@/app/_lib/actions';

export default function Page() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>Submit</button>
    </form>
  );
}
