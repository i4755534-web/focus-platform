'use client';

import { useState, useEffect, useCallback } from 'react';

interface VRSession {
  isSupported: boolean;
  isPresenting: boolean;
  session: XRSession | null;
  error: string | null;
}

interface UseVRReturn extends VRSession {
  enterVR: () => Promise<void>;
  exitVR: () => Promise<void>;
  requestSession: (mode: XRSessionMode) => Promise<XRSession>;
}

export const useVR = (): UseVRReturn => {
  const [vrState, setVrState] = useState<VRSession>({
    isSupported: false,
    isPresenting: false,
    session: null,
    error: null,
  });

  useEffect(() => {
    const checkVRSupport = async () => {
      if (!navigator.xr) {
        setVrState(prev => ({ ...prev, isSupported: false, error: 'WebXR not supported' }));
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        setVrState(prev => ({ ...prev, isSupported: !!supported }));
      } catch (error) {
        setVrState(prev => ({
          ...prev,
          isSupported: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    checkVRSupport();
  }, []);

  const requestSession = useCallback(async (mode: XRSessionMode): Promise<XRSession> => {
    if (!navigator.xr) {
      throw new Error('WebXR not supported');
    }

    try {
      const session = await navigator.xr.requestSession(mode, {
        requiredFeatures: ['local-floor', 'bounded-floor'],
        optionalFeatures: ['hand-tracking', 'layers'],
      });

      setVrState(prev => ({ ...prev, session, isPresenting: true }));

      session.addEventListener('end', () => {
        setVrState(prev => ({ ...prev, session: null, isPresenting: false }));
      });

      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start VR session';
      setVrState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const enterVR = useCallback(async () => {
    if (!vrState.isSupported) {
      throw new Error('VR not supported');
    }

    if (vrState.isPresenting) {
      return; // Already in VR
    }

    await requestSession('immersive-vr');
  }, [vrState.isSupported, vrState.isPresenting, requestSession]);

  const exitVR = useCallback(async () => {
    if (!vrState.session) {
      return;
    }

    try {
      await vrState.session.end();
    } catch (error) {
      console.error('Error ending VR session:', error);
    }
  }, [vrState.session]);

  return {
    ...vrState,
    enterVR,
    exitVR,
    requestSession,
  };
};