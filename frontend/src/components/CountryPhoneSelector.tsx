import React from 'react';
import {
    TextField,
    MenuItem,
    Box,
    InputAdornment,
    Typography,
} from '@mui/material';
import { Phone } from '@mui/icons-material';

interface Country {
    code: string;
    name: string;
    prefix: string;
    flag: string;
}

interface CountryPhoneSelectorProps {
    countryCode: string;
    phoneNumber: string;
    onCountryChange: (countryCode: string) => void;
    onPhoneChange: (phoneNumber: string) => void;
    required?: boolean;
    error?: boolean;
    helperText?: string;
}

const countries: Country[] = [
    { code: 'CO', name: 'Colombia', prefix: '+57', flag: '🇨🇴' },
    { code: 'US', name: 'Estados Unidos', prefix: '+1', flag: '🇺🇸' },
    { code: 'MX', name: 'México', prefix: '+52', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', prefix: '+54', flag: '🇦🇷' },
    { code: 'BR', name: 'Brasil', prefix: '+55', flag: '🇧🇷' },
    { code: 'CL', name: 'Chile', prefix: '+56', flag: '🇨🇱' },
    { code: 'PE', name: 'Perú', prefix: '+51', flag: '🇵🇪' },
    { code: 'EC', name: 'Ecuador', prefix: '+593', flag: '🇪🇨' },
    { code: 'VE', name: 'Venezuela', prefix: '+58', flag: '🇻🇪' },
    { code: 'BO', name: 'Bolivia', prefix: '+591', flag: '🇧🇴' },
    { code: 'PY', name: 'Paraguay', prefix: '+595', flag: '🇵🇾' },
    { code: 'UY', name: 'Uruguay', prefix: '+598', flag: '🇺🇾' },
    { code: 'CR', name: 'Costa Rica', prefix: '+506', flag: '🇨🇷' },
    { code: 'PA', name: 'Panamá', prefix: '+507', flag: '🇵🇦' },
    { code: 'GT', name: 'Guatemala', prefix: '+502', flag: '🇬🇹' },
    { code: 'HN', name: 'Honduras', prefix: '+504', flag: '🇭🇳' },
    { code: 'SV', name: 'El Salvador', prefix: '+503', flag: '🇸🇻' },
    { code: 'NI', name: 'Nicaragua', prefix: '+505', flag: '🇳🇮' },
    { code: 'DO', name: 'República Dominicana', prefix: '+1', flag: '🇩🇴' },
    { code: 'CU', name: 'Cuba', prefix: '+53', flag: '🇨🇺' },
    { code: 'ES', name: 'España', prefix: '+34', flag: '🇪🇸' },
    { code: 'FR', name: 'Francia', prefix: '+33', flag: '🇫🇷' },
    { code: 'DE', name: 'Alemania', prefix: '+49', flag: '🇩🇪' },
    { code: 'IT', name: 'Italia', prefix: '+39', flag: '🇮🇹' },
    { code: 'GB', name: 'Reino Unido', prefix: '+44', flag: '🇬🇧' },
    { code: 'CA', name: 'Canadá', prefix: '+1', flag: '🇨🇦' },
];

const CountryPhoneSelector: React.FC<CountryPhoneSelectorProps> = ({
    countryCode,
    phoneNumber,
    onCountryChange,
    onPhoneChange,
    required = false,
    error = false,
    helperText = '',
}) => {

    return (
        <Box sx={{ 
            display: 'flex', 
            gap: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%'
        }}>
            {/* Selector de País */}
            <TextField
                select
                value={countryCode}
                onChange={(e) => onCountryChange(e.target.value)}
                sx={{
                    width: { xs: '100%', sm: '140px' },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                            borderColor: 'primary.main',
                        },
                    },
                }}
                SelectProps={{
                    renderValue: (value) => {
                        const country = countries.find(c => c.code === value);
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: '1.1rem' }}>
                                    {country?.flag}
                                </Typography>
                                <Typography variant="body2">
                                    {country?.prefix}
                                </Typography>
                            </Box>
                        );
                    }
                }}
            >
                {countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontSize: '1.1rem' }}>
                                {country.flag}
                            </Typography>
                            <Typography variant="body2" sx={{ minWidth: '45px' }}>
                                {country.prefix}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {country.name}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </TextField>

            {/* Campo de Teléfono */}
            <TextField
                required={required}
                fullWidth
                label="Teléfono"
                value={phoneNumber}
                onChange={(e) => onPhoneChange(e.target.value)}
                error={error}
                helperText={helperText}
                placeholder="Número de teléfono"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Phone sx={{ color: 'action.active' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                            borderColor: 'primary.main',
                        },
                    },
                }}
            />
        </Box>
    );
};

export default CountryPhoneSelector;
