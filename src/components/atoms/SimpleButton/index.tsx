import { Button } from '@radix-ui/themes';
import { ButtonProps } from '@radix-ui/themes/dist/cjs/components/button';

export const SimpleButton = (props: ButtonProps): JSX.Element => {
  const { children, disabled, variant, ...rest } = props;
  return (
    <Button disabled={disabled} variant={variant ? variant : 'soft'} {...rest}>
      {children}
    </Button>
  );
};

export default SimpleButton;
