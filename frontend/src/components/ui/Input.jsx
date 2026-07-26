import React from 'react';
import { motion } from 'framer-motion';

export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <motion.input
      ref={ref}
      whileFocus={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`glass-input w-full ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
