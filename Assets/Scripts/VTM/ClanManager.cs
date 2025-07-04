using System;
using System.Collections.Generic;
using UnityEngine;

namespace VTM
{
    /// <summary>
    /// Represents a Vampire: The Masquerade clan with their characteristics
    /// </summary>
    [Serializable]
    public class VampireClan
    {
        public string name;
        public Color clanColor;
        public string description;
        public List<string> disciplines;
        public string bane;
        public string compulsion;
        
        public VampireClan(string name, Color color, string description)
        {
            this.name = name;
            this.clanColor = color;
            this.description = description;
            this.disciplines = new List<string>();
        }
    }

    /// <summary>
    /// Manager for all VTM clans and their properties
    /// </summary>
    public static class ClanManager
    {
        private static Dictionary<string, VampireClan> _clans;
        
        public static Dictionary<string, VampireClan> Clans
        {
            get
            {
                if (_clans == null)
                    InitializeClans();
                return _clans;
            }
        }
        
        private static void InitializeClans()
        {
            _clans = new Dictionary<string, VampireClan>();
            
            // Ventrue - Blue
            var ventrue = new VampireClan("Ventrue", new Color(0.1f, 0.2f, 0.36f, 1f), "The clan of kings and nobles");
            ventrue.disciplines.AddRange(new[] { "Dominate", "Fortitude", "Presence" });
            ventrue.bane = "Must feed only on a specific type of mortal";
            ventrue.compulsion = "Arrogance";
            _clans.Add("Ventrue", ventrue);
            
            // Toreador - Red
            var toreador = new VampireClan("Toreador", new Color(0.77f, 0.19f, 0.19f, 1f), "The clan of artists and hedonists");
            toreador.disciplines.AddRange(new[] { "Auspex", "Celerity", "Presence" });
            toreador.bane = "Become entranced by beauty";
            toreador.compulsion = "Obsession";
            _clans.Add("Toreador", toreador);
            
            // Brujah - Yellow/Gold
            var brujah = new VampireClan("Brujah", new Color(0.84f, 0.62f, 0.18f, 1f), "The clan of rebels and warriors");
            brujah.disciplines.AddRange(new[] { "Celerity", "Potence", "Presence" });
            brujah.bane = "Difficulty resisting frenzy";
            brujah.compulsion = "Rebellion";
            _clans.Add("Brujah", brujah);
            
            // Malkavian - Purple
            var malkavian = new VampireClan("Malkavian", new Color(0.33f, 0.24f, 0.60f, 1f), "The clan of madmen and oracles");
            malkavian.disciplines.AddRange(new[] { "Auspex", "Dominate", "Obfuscate" });
            malkavian.bane = "Suffer from mental illness";
            malkavian.compulsion = "Delusion";
            _clans.Add("Malkavian", malkavian);
            
            // Nosferatu - Gray
            var nosferatu = new VampireClan("Nosferatu", new Color(0.18f, 0.22f, 0.28f, 1f), "The clan of information brokers");
            nosferatu.disciplines.AddRange(new[] { "Animalism", "Obfuscate", "Potence" });
            nosferatu.bane = "Hideous appearance";
            nosferatu.compulsion = "Cryptophilia";
            _clans.Add("Nosferatu", nosferatu);
            
            // Gangrel - Green
            var gangrel = new VampireClan("Gangrel", new Color(0.22f, 0.63f, 0.41f, 1f), "The clan of outlanders and survivalists");
            gangrel.disciplines.AddRange(new[] { "Animalism", "Fortitude", "Protean" });
            gangrel.bane = "Gain animal features when messy critical";
            gangrel.compulsion = "Feral Impulses";
            _clans.Add("Gangrel", gangrel);
            
            // Tremere - Dark Purple
            var tremere = new VampireClan("Tremere", new Color(0.50f, 0.35f, 0.83f, 1f), "The clan of blood sorcerers");
            tremere.disciplines.AddRange(new[] { "Auspex", "Dominate", "Blood Sorcery" });
            tremere.bane = "Must drink vampire blood monthly";
            tremere.compulsion = "Perfectionism";
            _clans.Add("Tremere", tremere);
        }
        
        public static VampireClan GetClan(string clanName)
        {
            return Clans.ContainsKey(clanName) ? Clans[clanName] : null;
        }
        
        public static Color GetClanColor(string clanName)
        {
            var clan = GetClan(clanName);
            return clan?.clanColor ?? Color.white;
        }
        
        public static List<string> GetAllClanNames()
        {
            return new List<string>(Clans.Keys);
        }
    }
}
