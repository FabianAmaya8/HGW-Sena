import 'package:flutter/material.dart';

class AppColors {
  // Paleta de verdes modernos con gradientes
  static const Color primaryGreen = Color(0xFF00C896);
  static const Color darkGreen = Color(0xFF00A076);
  static const Color lightGreen = Color(0xFF00E5A0);
  static const Color accentGreen = Color(0xFF7FFFD4);
  static const Color backgroundLight = Color(0xFFF0FFF9);
  static const Color surfaceWhite = Color(0xFFFFFFFF);

  // Colores de apoyo
  static const Color textDark = Color(0xFF1A1F36);
  static const Color textMedium = Color(0xFF4E5D78);
  static const Color textLight = Color(0xFF8492A6);
  static const Color borderColor = Color(0xFFE0E6ED);
  static const Color errorColor = Color(0xFFFF4757);
  static const Color warningColor = Color(0xFFFFA502);
  static const Color successColor = Color(0xFF00C896);

  // Gradientes
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryGreen, lightGreen],
  );

  static const LinearGradient darkGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [darkGreen, primaryGreen],
  );

  static get textPrimary => null;
}

class AppTheme {
  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryGreen,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: AppColors.backgroundLight,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: AppColors.textDark),
        titleTextStyle: TextStyle(
          color: AppColors.textDark,
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.borderColor, width: 1),
        ),
        color: AppColors.surfaceWhite,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryGreen,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      chipTheme: const ChipThemeData(
        backgroundColor: AppColors.surfaceWhite,
        selectedColor: AppColors.primaryGreen,
        side: BorderSide(color: AppColors.borderColor),
        showCheckmark: false,
        labelStyle: TextStyle(color: AppColors.textMedium),
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
      fontFamily: 'SF Pro Display',
    );
  }
}

class AppStyles {
  static const TextStyle heading1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textDark,
    letterSpacing: -0.5,
  );

  static const TextStyle heading2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    color: AppColors.textDark,
  );

  static const TextStyle heading3 = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.textDark,
  );

  static const TextStyle body = TextStyle(
    fontSize: 16,
    color: AppColors.textMedium,
    height: 1.5,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 14,
    color: AppColors.textLight,
  );

  static const TextStyle price = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.primaryGreen,
  );
}
