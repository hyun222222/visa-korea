from typing import Dict, List, Any

# 2025 GNI (example value - should be updated annually)
GNI_KRW = 45000000

class VisaRecommender:
    """
    Core visa recommendation logic based on user profile.
    References the 2025.11 Immigration Manual.
    """
    
    @staticmethod
    def recommend_visa(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Recommend suitable visas based on user profile.
        
        Args:
            profile: User profile data containing age, education, income, etc.
            
        Returns:
            List of visa recommendations with probability and reasons
        """
        recommendations = []
        
        age = profile.get('age', 0)
        education = profile.get('degree_level')
        income = profile.get('annual_income_krw', 0)
        purpose = profile.get('purpose')
        is_top_tier = profile.get('is_in_top_tier_field', False)
        korean_level = profile.get('korean_level', 0)
        career_years = profile.get('career_years', 0)
        
        income_gni_ratio = income / GNI_KRW if income and GNI_KRW else 0
        
        # Top-Tier Visa (E-7-T / E-7-S)
        if is_top_tier and education in ['master', 'doctor'] and income_gni_ratio >= 2.5:
            recommendations.append({
                'visa_code': 'E-7-T',
                'visa_name': 'Top-Tier (Advanced Technology Sector)',
                'probability': 'high',
                'reasons': [
                    'Advanced technology sector employment',
                    f'Graduate degree ({education})',
                    f'Income: {income_gni_ratio:.1f}x GNI (meets high-income requirement)'
                ],
                'missing_requirements': [],
                'score': None
            })
        
        # E-7-1 (Professional Employment)
        if purpose == 'employment':
            e7_eligible = False
            e7_reasons = []
            e7_missing = []
            
            if education in ['bachelor', 'master', 'doctor']:
                e7_eligible = True
                e7_reasons.append(f'{education.capitalize()} degree holder')
            
            if career_years >= 1:
                e7_reasons.append(f'{career_years} years of work experience')
                e7_eligible = True
            
            if income_gni_ratio >= 0.8:
                e7_reasons.append(f'Income: {income_gni_ratio:.1f}x GNI')
            else:
                e7_missing.append(f'Income should be ≥ 0.8x GNI (currently {income_gni_ratio:.1f}x)')
            
            if e7_eligible:
                recommendations.append({
                    'visa_code': 'E-7-1',
                    'visa_name': 'E-7-1 (Specially Designated Activities - Professional)',
                    'probability': 'high' if not e7_missing else 'medium',
                    'reasons': e7_reasons,
                    'missing_requirements': e7_missing,
                    'score': None
                })
        
        # F-2-7 (Residence - Point System)
        if purpose in ['residence', 'employment']:
            f27_score = VisaRecommender._calculate_f27_score(profile)
            recommendations.append({
                'visa_code': 'F-2-7',
                'visa_name': 'F-2-7 (Residence - Highly Skilled)',
                'probability': 'high' if f27_score >= 80 else 'low',
                'reasons': [f'Estimated points: {f27_score}'],
                'missing_requirements': [f'Need {80 - f27_score} more points'] if f27_score < 80 else [],
                'score': f27_score
            })
        
        # E-7-4 (Skilled Worker - K-Point)
        if purpose == 'employment' and career_years >= 2:
            recommendations.append({
                'visa_code': 'E-7-4',
                'visa_name': 'E-7-4 (Skilled Worker - K-Point System)',
                'probability': 'medium',
                'reasons': [
                    f'{career_years} years of skilled work experience',
                    'K-Point system assessment required'
                ],
                'missing_requirements': ['Detailed K-Point calculation needed'],
                'score': None
            })
        
        # Sort by probability
        probability_order = {'high': 3, 'medium': 2, 'low': 1}
        recommendations.sort(key=lambda x: probability_order.get(x['probability'], 0), reverse=True)
        
        return recommendations
    
    @staticmethod
    def _calculate_f27_score(profile: Dict[str, Any]) -> int:
        """
        Calculate F-2-7 points based on age, education, income, Korean ability.
        Simplified version - actual calculation should use score_tables from DB.
        """
        score = 0
        age = profile.get('age', 0)
        education = profile.get('degree_level')
        income = profile.get('annual_income_krw', 0)
        korean_level = profile.get('korean_level', 0)
        
        # Age points
        if 25 <= age <= 29:
            score += 25
        elif 30 <= age <= 34:
            score += 23
        elif 35 <= age <= 39:
            score += 20
        elif 40 <= age <= 44:
            score += 12
        
        # Education points
        if education == 'doctor':
            score += 30
        elif education == 'master':
            score += 25
        elif education == 'bachelor':
            score += 20
        
        # Income points
        income_ratio = income / GNI_KRW if income and GNI_KRW else 0
        if income_ratio >= 2.0:
            score += 30
        elif income_ratio >= 1.5:
            score += 25
        elif income_ratio >= 1.0:
            score += 20
        
        # Korean ability points
        if korean_level >= 6:
            score += 20
        elif korean_level >= 5:
            score += 18
        elif korean_level >= 4:
            score += 16
        elif korean_level >= 3:
            score += 14
        
        return score
