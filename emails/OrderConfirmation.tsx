import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

export interface OrderConfirmationProps {
  orderId: string;
  certificateNumber: string;
  reference: string;
  amount: number;
  currency: string;
  paidAt: string;
  channel?: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode?: string;
    notes?: string;
  };
  items: OrderItem[];
}

// ─── Currency formatter ───────────────────────────────────────────────────────
function formatCurrency(amount: number, currency: string): string {
  const upper = currency.toUpperCase();
  if (upper === 'KES') return `KES ${amount.toLocaleString('en-KE')}`;
  if (upper === 'NGN') return `₦${amount.toLocaleString('en-NG')}`;
  return `$${amount.toLocaleString('en-US')}`;
}

// ─── Channel label ────────────────────────────────────────────────────────────
function channelLabel(channel?: string): string {
  const map: Record<string, string> = {
    card: 'Credit / Debit Card',
    mobile_money: 'Mobile Money',
    bank_transfer: 'Bank Transfer',
    apple_pay: 'Apple Pay',
  };
  return channel ? (map[channel] ?? channel) : 'Secure Gateway';
}

// ─── Date formatter ───────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return iso;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderConfirmation({
  orderId = 'MSG-000001-ABCDEF',
  certificateNumber = 'CERT-SG-2026-ABCDEF',
  reference = 'msg_1234567890_abc123',
  amount = 1550,
  currency = 'KES',
  paidAt = new Date().toISOString(),
  channel = 'card',
  customer = {
    fullName: 'Jane Wambui',
    email: 'jane@example.com',
    phone: '+254 712 345 678',
    address: '14 Limuru Road, Karen',
    city: 'Nairobi',
    country: 'Kenya',
    postalCode: '00100',
    notes: '',
  },
  items = [
    {
      id: 'vntg-001',
      title: '1982 Double-Breasted Cashmere Trench',
      quantity: 1,
      price: 1550,
    },
  ],
}: OrderConfirmationProps) {
  const previewText = `Your archival acquisition is confirmed — Order ${orderId}`;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Georgia"
          fallbackFontFamily="serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/cormorantgaramond/v22/co3WmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>{previewText}</Preview>

      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                charcoal: '#1A1615',
                cream: '#FDFBF7',
                parchment: '#F4EFE6',
                gold: '#C5A880',
                taupe: '#7A7067',
                sage: '#23342B',
                sienna: '#9E7B4F',
              },
            },
          },
        }}
      >
        <Body style={{ backgroundColor: '#F0EBE2', fontFamily: 'Georgia, serif', margin: 0, padding: 0 }}>

          {/* ── Outer wrapper ── */}
          <Container style={{ maxWidth: '600px', margin: '32px auto', backgroundColor: '#FDFBF7' }}>

            {/* ── Top Gold Rule ── */}
            <Section style={{ backgroundColor: '#C5A880', height: '4px' }} />

            {/* ── Header ── */}
            <Section style={{ backgroundColor: '#1A1615', padding: '40px 48px 32px' }}>
              {/* Eyebrow */}
              <Text
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: '#C5A880',
                  textAlign: 'center',
                  margin: '0 0 6px',
                }}
              >
                Maison Saint-Germain · Archival Acquisition
              </Text>

              {/* Brand Name */}
              <Heading
                as="h1"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: '#FDFBF7',
                  textAlign: 'center',
                  margin: '0 0 6px',
                  letterSpacing: '-0.02em',
                }}
              >
                Maison Saint-Germain
              </Heading>

              <Text
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#9C9287',
                  textAlign: 'center',
                  margin: '0 0 28px',
                }}
              >
                Archive &amp; Quiet Luxury · Est. Paris, 1984
              </Text>

              {/* Divider */}
              <Row>
                <Column align="center">
                  <Section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#C5A880', fontSize: '12px', margin: 0, letterSpacing: '0.3em' }}>
                      ✦ &nbsp; Acquisition Confirmed &nbsp; ✦
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            {/* ── Certificate Banner ── */}
            <Section style={{ backgroundColor: '#23342B', padding: '20px 48px' }}>
              <Row>
                <Column>
                  <Text
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#A8C4B0',
                      margin: '0 0 2px',
                    }}
                  >
                    Deed of Provenance
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#FDFBF7',
                      margin: 0,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {certificateNumber}
                  </Text>
                </Column>
                <Column align="right">
                  <Text
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#A8C4B0',
                      margin: '0 0 2px',
                    }}
                  >
                    Paystack Reference
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '12px',
                      color: '#C5A880',
                      margin: 0,
                    }}
                  >
                    {reference}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ── Body ── */}
            <Section style={{ padding: '40px 48px' }}>

              {/* Greeting */}
              <Heading
                as="h2"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#1A1615',
                  margin: '0 0 12px',
                }}
              >
                Dear {customer.fullName},
              </Heading>

              <Text
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '15px',
                  lineHeight: '1.75',
                  color: '#4E443E',
                  margin: '0 0 24px',
                }}
              >
                Your archival acquisition has been confirmed and payment successfully verified.
                Each piece you have selected has been individually wrapped in our museum-grade
                cedar preservation casing and is being prepared for dispatch with our insured
                courier service.
              </Text>

              {/* Payment Confirmed Badge */}
              <Section
                style={{
                  backgroundColor: '#EBF3EE',
                  border: '1px solid #BDD9C6',
                  borderRadius: '2px',
                  padding: '14px 18px',
                  marginBottom: '28px',
                }}
              >
                <Row>
                  <Column style={{ width: '24px', verticalAlign: 'middle' }}>
                    <Text style={{ fontSize: '16px', margin: 0 }}>✓</Text>
                  </Column>
                  <Column style={{ verticalAlign: 'middle' }}>
                    <Text
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#1E452C',
                        margin: '0 0 2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Payment Verified via {channelLabel(channel)}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '10px',
                        color: '#2F5E3D',
                        margin: 0,
                      }}
                    >
                      {formatDate(paidAt)} · Order {orderId}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* ── Order Items ── */}
              <Text
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#9E7B4F',
                  fontWeight: 700,
                  margin: '0 0 12px',
                  borderBottom: '1px solid #EDE7DD',
                  paddingBottom: '8px',
                }}
              >
                Itemised Provenance Manifest
              </Text>

              {items.map((item, idx) => (
                <Row
                  key={item.id}
                  style={{
                    borderBottom: idx < items.length - 1 ? '1px solid #F2ECE1' : 'none',
                    paddingBottom: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <Column style={{ verticalAlign: 'top', paddingRight: '12px' }}>
                    <Text
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1A1615',
                        margin: '0 0 2px',
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '10px',
                        color: '#7A7067',
                        margin: 0,
                      }}
                    >
                      Qty: {item.quantity} · Certified Authentic · Single Edition
                    </Text>
                  </Column>
                  <Column align="right" style={{ whiteSpace: 'nowrap', verticalAlign: 'top', minWidth: '80px' }}>
                    <Text
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#1A1615',
                        margin: 0,
                      }}
                    >
                      {formatCurrency(item.price * item.quantity, currency)}
                    </Text>
                  </Column>
                </Row>
              ))}

              {/* Total Row */}
              <Section
                style={{
                  backgroundColor: '#F4EFE6',
                  border: '1px solid #E2DAD0',
                  borderRadius: '2px',
                  padding: '14px 18px',
                  marginTop: '8px',
                  marginBottom: '32px',
                }}
              >
                <Row>
                  <Column>
                    <Text
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1A1615',
                        margin: '0 0 4px',
                      }}
                    >
                      Total Settlement
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '10px',
                        color: '#7A7067',
                        margin: 0,
                      }}
                    >
                      Preservation &amp; Insured Courier Included
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#1A1615',
                        margin: 0,
                      }}
                    >
                      {formatCurrency(amount, currency)}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* ── Shipping Details ── */}
              <Text
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#9E7B4F',
                  fontWeight: 700,
                  margin: '0 0 12px',
                  borderBottom: '1px solid #EDE7DD',
                  paddingBottom: '8px',
                }}
              >
                Courier Destination
              </Text>

              <Section
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E2DAD0',
                  borderRadius: '2px',
                  padding: '16px 18px',
                  marginBottom: '32px',
                }}
              >
                <Row>
                  <Column>
                    <Text
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1A1615',
                        margin: '0 0 4px',
                      }}
                    >
                      {customer.fullName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '11px',
                        color: '#5C524B',
                        lineHeight: '1.6',
                        margin: 0,
                      }}
                    >
                      {customer.address}
                      {'\n'}
                      {customer.city}
                      {customer.postalCode ? `, ${customer.postalCode}` : ''}
                      {'\n'}
                      {customer.country}
                    </Text>
                  </Column>
                  <Column align="right" style={{ verticalAlign: 'top' }}>
                    <Text
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '10px',
                        color: '#7A7067',
                        margin: '0 0 4px',
                      }}
                    >
                      {customer.phone}
                    </Text>
                    <Section
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#EDE7DD',
                        padding: '3px 10px',
                        borderRadius: '2px',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Courier New, monospace',
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: '#23342B',
                          margin: 0,
                          fontWeight: 700,
                        }}
                      >
                        Insured Armored Courier
                      </Text>
                    </Section>
                  </Column>
                </Row>

                {customer.notes && (
                  <>
                    <Hr style={{ borderColor: '#E8E2D8', margin: '12px 0' }} />
                    <Text
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '10px',
                        color: '#7A7067',
                        margin: '0 0 2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Special Instructions
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '12px',
                        fontStyle: 'italic',
                        color: '#5C524B',
                        margin: 0,
                      }}
                    >
                      {customer.notes}
                    </Text>
                  </>
                )}
              </Section>

              {/* ── What's in your parcel ── */}
              <Text
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#9E7B4F',
                  fontWeight: 700,
                  margin: '0 0 12px',
                  borderBottom: '1px solid #EDE7DD',
                  paddingBottom: '8px',
                }}
              >
                What&apos;s Inside Your Archival Parcel
              </Text>

              {[
                { icon: '🌲', title: 'Museum Cedar Garment Bag', desc: 'Each piece is stored in a sealed, acid-free cedar preservation bag that protects fibres for decades.' },
                { icon: '📜', title: 'Physical Deed of Provenance', desc: `Certificate ${certificateNumber} — hand-signed by our archival curator, shipped alongside your pieces.` },
                { icon: '🔒', title: 'Archival Authenticity Card', desc: 'A pocket-sized authentication card with the unique certificate ID for your records.' },
              ].map(({ icon, title, desc }) => (
                <Row key={title} style={{ marginBottom: '16px' }}>
                  <Column style={{ width: '36px', verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '20px', margin: 0, lineHeight: 1 }}>{icon}</Text>
                  </Column>
                  <Column style={{ verticalAlign: 'top' }}>
                    <Text
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1A1615',
                        margin: '0 0 2px',
                      }}
                    >
                      {title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '12px',
                        color: '#5C524B',
                        lineHeight: '1.6',
                        margin: 0,
                      }}
                    >
                      {desc}
                    </Text>
                  </Column>
                </Row>
              ))}

              {/* ── Closing note ── */}
              <Section
                style={{
                  borderLeft: '2px solid #C5A880',
                  paddingLeft: '18px',
                  marginTop: '28px',
                  marginBottom: '8px',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    lineHeight: '1.8',
                    color: '#4E443E',
                    margin: 0,
                  }}
                >
                  &ldquo;Every archival piece carries within it a fragment of time — a gesture, a season,
                  a quiet elegance. We are honoured to place it in your stewardship.&rdquo;
                </Text>
                <Text
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '10px',
                    color: '#9E7B4F',
                    margin: '10px 0 0',
                    letterSpacing: '0.1em',
                  }}
                >
                  — The Maison Saint-Germain Archival House
                </Text>
              </Section>
            </Section>

            {/* ── Separator ── */}
            <Hr style={{ borderColor: '#E8E2D8', margin: 0 }} />

            {/* ── Footer ── */}
            <Section style={{ backgroundColor: '#1A1615', padding: '28px 48px' }}>
              <Text
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#C5A880',
                  textAlign: 'center',
                  margin: '0 0 12px',
                }}
              >
                Maison Saint-Germain · Archive &amp; Quiet Luxury
              </Text>

              <Text
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '10px',
                  color: '#7A7067',
                  textAlign: 'center',
                  lineHeight: '1.7',
                  margin: '0 0 12px',
                }}
              >
                Questions about your order? Reply to this email or contact our archival concierge.
                {'\n'}
                Please retain this email as your official proof of acquisition.
              </Text>

              <Hr style={{ borderColor: '#2C2624', margin: '12px 0' }} />

              <Row>
                <Column align="center">
                  <Text
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '9px',
                      color: '#4A423E',
                      textAlign: 'center',
                      margin: 0,
                      lineHeight: '1.6',
                    }}
                  >
                    © {new Date().getFullYear()} Maison Saint-Germain. All rights reserved.
                    {'\n'}
                    This email was sent to {customer.email} following your purchase.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ── Bottom Gold Rule ── */}
            <Section style={{ backgroundColor: '#C5A880', height: '4px' }} />

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
