'use client';

import React, { useRef, useEffect } from 'react';
import { useController, useXR } from '@react-three/xr';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VRControlsProps {
  onGesture?: (gesture: string) => void;
  onMovement?: (direction: THREE.Vector3) => void;
}

export const VRControls: React.FC<VRControlsProps> = ({ onGesture, onMovement }) => {
  const { controllers, isPresenting } = useXR();
  const leftController = useController('left');
  const rightController = useController('right');

  const previousPositions = useRef<{ left?: THREE.Vector3; right?: THREE.Vector3 }>({});

  useFrame(() => {
    if (!isPresenting) return;

    // Handle controller movements for teleportation or movement
    if (leftController && rightController) {
      const leftPos = leftController.controller.position.clone();
      const rightPos = rightController.controller.position.clone();

      // Detect gestures based on controller positions
      if (previousPositions.current.left && previousPositions.current.right) {
        const leftDelta = leftPos.clone().sub(previousPositions.current.left);
        const rightDelta = rightPos.clone().sub(previousPositions.current.right);

        // Simple gesture detection: waving hands
        if (leftDelta.length() > 0.1 || rightDelta.length() > 0.1) {
          onGesture?.('wave');
        }

        // Pointing gesture
        const leftForward = new THREE.Vector3(0, 0, -1).applyQuaternion(leftController.controller.quaternion);
        const rightForward = new THREE.Vector3(0, 0, -1).applyQuaternion(rightController.controller.quaternion);

        if (leftForward.dot(new THREE.Vector3(0, 0, -1)) > 0.8) {
          onGesture?.('point_left');
        }
        if (rightForward.dot(new THREE.Vector3(0, 0, -1)) > 0.8) {
          onGesture?.('point_right');
        }
      }

      previousPositions.current.left = leftPos;
      previousPositions.current.right = rightPos;
    }
  });

  useEffect(() => {
    if (!leftController || !rightController) return;

    const handleSelectStart = (event: any) => {
      // Voice activation gesture
      onGesture?.('voice_start');
    };

    const handleSelectEnd = (event: any) => {
      onGesture?.('voice_end');
    };

    const handleSqueezeStart = (event: any) => {
      // Movement gesture
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(event.target.quaternion);
      onMovement?.(direction);
    };

    leftController.controller.addEventListener('selectstart', handleSelectStart);
    leftController.controller.addEventListener('selectend', handleSelectEnd);
    leftController.controller.addEventListener('squeezestart', handleSqueezeStart);

    rightController.controller.addEventListener('selectstart', handleSelectStart);
    rightController.controller.addEventListener('selectend', handleSelectEnd);
    rightController.controller.addEventListener('squeezestart', handleSqueezeStart);

    return () => {
      leftController.controller.removeEventListener('selectstart', handleSelectStart);
      leftController.controller.removeEventListener('selectend', handleSelectEnd);
      leftController.controller.removeEventListener('squeezestart', handleSqueezeStart);

      rightController.controller.removeEventListener('selectstart', handleSelectStart);
      rightController.controller.removeEventListener('selectend', handleSelectEnd);
      rightController.controller.removeEventListener('squeezestart', handleSqueezeStart);
    };
  }, [leftController, rightController, onGesture, onMovement]);

  return null; // This component doesn't render anything visible
};