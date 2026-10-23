'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
export default function Page(){const router=useRouter();useEffect(()=>router.replace('/commande/'),[router]);return null;}
