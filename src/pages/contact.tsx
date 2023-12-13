/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SimpleButton } from '@/components/atoms/SimpleButton';
import { SimpleToast } from '@/components/atoms/SimpleToast';
import useResponsive from '@/hooks/useResponsive';
import { TBreakpoint } from '@/interfaces/TBreakpoint';
import { send } from '@emailjs/browser';
import * as Label from '@radix-ui/react-label';
import { Box } from '@radix-ui/themes';
import Head from 'next/head';
import { FormEvent, useState } from 'react';

const mappingPaddingMainBox = (breakpoint: TBreakpoint): number => {
  const mapping = {
    desktop: 40,
    tablet: 30,
    mobile: 15,
  };

  return mapping[breakpoint] || 30;
};

export default function Contact(): JSX.Element {
  const [form, setform] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (campo: string, valor: string): void => {
    setform({
      ...form,
      [campo]: valor,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const templateParams = {
      name: form.name,
      email: form.email,
      message: form.message,
    };

    send(
      //@ts-ignore
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.EMAILJS_PUBLIC_KEY
    ).then(
      (response) => {
        console.log('Email enviado!', response.status);
        setform({
          name: '',
          email: '',
          message: '',
        });
      },
      (err) => {
        console.log('Error!', err);
      }
    );
  };
  const [openToast, setOpenToast] = useState(false);

  const breakpoint = useResponsive();

  const paddingMainBox = mappingPaddingMainBox(breakpoint);

  return (
    <>
      <Head>
        <title>Rotating Pairs</title>
        <meta name="description" content="Random Rotating Pair Generator for Pair Programming" />
        <link rel="icon" href="/iconDrawPairProgramming.svg" />
      </Head>
      <main>
        {openToast && (
          <SimpleToast
            setOpen={setOpenToast}
            open={openToast}
            title={'Well Done!!'}
            description={'Your combinations have been copied'}
          />
        )}
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: paddingMainBox,
          }}
        >
          <form
            onSubmit={(e): void => {
              handleSubmit(e);
            }}
          >
            <div
              style={{
                display: 'flex',
                padding: '0 20px',
                flexWrap: 'wrap',
                gap: 15,
                alignItems: 'center',
                margin: '10px',
              }}
            >
              <Label.Root className="LabelRoot" htmlFor="name">
                Name:
              </Label.Root>
              <input
                className="Input"
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={(e): void => handleChange('name', e.target.value)}
                required
                onInvalid={(e): void => {
                  //@ts-ignore
                  e.target.setCustomValidity('');
                  //@ts-ignore
                  if (!e.target.validity.valid) {
                    //@ts-ignore
                    e.target.setCustomValidity('This field cannot be left blank');
                  }
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                padding: '0 20px',
                flexWrap: 'wrap',
                gap: 15,
                alignItems: 'center',
                margin: '10px',
              }}
            >
              <Label.Root className="LabelRoot" htmlFor="email">
                E-mail:
              </Label.Root>
              <input
                className="Input"
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={(e): void => handleChange('email', e.target.value)}
                required
                onInvalid={(e): void => {
                  //@ts-ignore
                  e.target.setCustomValidity('');
                  //@ts-ignore
                  if (!e.target.validity.valid) {
                    //@ts-ignore
                    e.target.setCustomValidity(
                      'Please enter a valid email address, which must be in the following format: "example@example.com"'
                    );
                  }
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                padding: '0 20px',
                flexWrap: 'wrap',
                gap: 15,
                alignItems: 'center',
              }}
            >
              <Label.Root className="LabelRoot" htmlFor="message">
                Message:
              </Label.Root>
              <textarea
                className="Input"
                id="message"
                name="message"
                style={{ minHeight: '200px' }}
                value={form.message}
                onChange={(e): void => handleChange('message', e.target.value)}
                required
                onInvalid={(e): void => {
                  //@ts-ignore
                  e.target.setCustomValidity('');
                  //@ts-ignore
                  if (!e.target.validity.valid) {
                    //@ts-ignore
                    e.target.setCustomValidity('This field cannot be left blank');
                  }
                }}
              />
            </div>

            <SimpleButton type="submit">Enviar</SimpleButton>
          </form>
        </Box>
      </main>
    </>
  );
}